<?php
declare(strict_types=1);
require_once __DIR__ . '/../services/visits/VisitLog.php';

$directory = sys_get_temp_dir() . '/go-visit-test-' . bin2hex(random_bytes(8));
$id = '12345678-1234-4123-8123-123456789012';
function check(bool $condition, string $message): void {
    if (!$condition) throw new RuntimeException($message);
    echo "OK: $message\n";
}
try {
    check(!is_dir($directory), 'no files before a visit');
    $winter = new DateTimeImmutable('2026-11-14T23:15:00Z');
    check(VisitLog::record($directory, $id, $winter), 'first visit creates a Markdown file');
    $path = $directory . '/2026-11-15.md';
    $content = file_get_contents($path);
    check(str_contains($content, '- Total de visitas: 1') && str_contains($content, '00:15:00 +01:00'), 'Madrid date, hour and total');
    check(!VisitLog::record($directory, $id, $winter), 'reload is deduplicated');
    check(file_get_contents($path) === $content, 'duplicate does not modify the file');
    check(VisitLog::record($directory, '22345678-1234-4123-8123-123456789012', $winter), 'different session counts');
    check(str_contains(file_get_contents($path), '- Total de visitas: 2'), 'daily total updates');
    check(!str_contains(file_get_contents($path), $id), 'raw session IDs are not stored');
    $summer = new DateTimeImmutable('2026-07-14T22:20:00Z');
    VisitLog::record($directory, $id, $summer);
    check(str_contains(file_get_contents($directory . '/2026-07-15.md'), '00:20:00 +02:00'), 'summer time uses correct date and offset');
    VisitLog::record($directory, $id, $winter->modify('+1 day'));
    check(is_file($directory . '/2026-11-16.md'), 'same session counts on a new day');
    try { VisitLog::record($directory, '../../bad', $winter); throw new RuntimeException('invalid ID accepted'); }
    catch (InvalidArgumentException $error) { check(true, 'invalid ID rejected'); }
    file_put_contents($directory . '/2026-11-17.md', 'invalid contents');
    try { VisitLog::record($directory, $id, $winter->modify('+2 days')); throw new RuntimeException('corrupt file accepted'); }
    catch (RuntimeException $error) { check(file_get_contents($directory . '/2026-11-17.md') === 'invalid contents', 'corrupt file is preserved'); }
} finally {
    // This exact, unique test directory contains only files created above.
    if (is_dir($directory)) {
        foreach (glob($directory . '/*.md') as $file) unlink($file);
        rmdir($directory);
    }
}

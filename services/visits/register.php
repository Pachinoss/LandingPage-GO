<?php
declare(strict_types=1);
require_once __DIR__ . '/VisitLog.php';

header('Cache-Control: no-store');
header('Content-Type: application/json; charset=utf-8');
header('Vary: Origin');
function finish(int $status): never {
    http_response_code($status);
    if ($status !== 204) echo json_encode(['success' => false]);
    exit;
}
$secure = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
$host = $_SERVER['HTTP_HOST'] ?? '';
$origin = getenv('VISIT_ALLOWED_ORIGIN') ?: (($secure ? 'https://' : 'http://') . $host);
if (($_SERVER['HTTP_ORIGIN'] ?? '') !== $origin) finish(403);
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
$method = $_SERVER['REQUEST_METHOD'] ?? '';
if ($method === 'OPTIONS') finish(204);
if ($method !== 'POST') finish(405);
if (!str_starts_with($_SERVER['CONTENT_TYPE'] ?? '', 'application/json')) finish(415);
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 1024) finish(413);
$body = file_get_contents('php://input', false, null, 0, 1025);
if ($body === false || strlen($body) > 1024) finish(413);
$event = json_decode($body, true);
if (!is_array($event)) finish(400);
$id = $event['id'] ?? null;
$started = $event['started'] ?? null;
$path = $event['path'] ?? null;
if (!is_string($id) || !preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $id)) finish(400);
if (!is_string($started) || strlen($started) > 30) finish(400);
try { $created = new DateTimeImmutable($started); } catch (Exception $error) { finish(400); }
if (abs(time() - $created->getTimestamp()) > 86400) finish(400);
$script = $_SERVER['SCRIPT_NAME'] ?? '';
$base = getenv('VISIT_BASE_PATH') ?: substr($script, 0, -strlen('services/visits/register.php'));
if (!is_string($path) || strlen($path) > 250 || !str_starts_with($path, $base) || str_starts_with($path, '//') || preg_match('/[\r\n?#\\\\]/', $path)) finish(400);
$directory = getenv('VISIT_LOG_DIR') ?: dirname(__DIR__, 2) . '/registros-visitas';
try {
    VisitLog::record($directory, $id, new DateTimeImmutable('now', new DateTimeZone('Europe/Madrid')));
    finish(204);
} catch (Throwable $error) {
    // Do not expose filesystem paths or log contents to the browser.
    error_log('Visit logger: could not record a visit');
    finish(503);
}

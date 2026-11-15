<?php
declare(strict_types=1);

/** Private Markdown storage. No emails, database or external packages. */
final class VisitLog
{
    public static function record(string $directory, string $session, DateTimeImmutable $time): bool
    {
        if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $session)) {
            throw new InvalidArgumentException('Invalid session');
        }
        $time = $time->setTimezone(new DateTimeZone('Europe/Madrid'));
        $day = $time->format('Y-m-d');
        if (!is_dir($directory) && !mkdir($directory, 0700, true) && !is_dir($directory)) {
            throw new RuntimeException('Cannot create visit directory');
        }
        $path = $directory . DIRECTORY_SEPARATOR . $day . '.md';
        $file = fopen($path, 'c+');
        if ($file === false) throw new RuntimeException('Cannot open visit log');
        try {
            if (!flock($file, LOCK_EX)) throw new RuntimeException('Cannot lock visit log');
            if ((fstat($file)['size'] ?? 0) > 8 * 1024 * 1024) throw new RuntimeException('Daily visit log size limit reached');
            $content = stream_get_contents($file);
            if ($content === false) throw new RuntimeException('Cannot read visit log');
            $receipt = '<!-- session:' . hash('sha256', $day . '/' . $session) . ' -->';
            if (str_contains($content, $receipt)) return false;
            $rows = '';
            $total = 0;
            if ($content !== '') {
                if (!preg_match('/^- Total de visitas: (\d+)$/m', $content, $matches) || !str_contains($content, "| Hora (Madrid) | Visita del día |\n| --- | --- |\n")) {
                    throw new RuntimeException('Existing log has an invalid format');
                }
                $total = (int) $matches[1];
                $rows = explode("| Hora (Madrid) | Visita del día |\n| --- | --- |\n", $content, 2)[1];
            }
            ++$total;
            $rows .= '| ' . $time->format('H:i:s P') . ' | ' . $total . ' | ' . $receipt . "\n";
            $markdown = '# Registro de visitas — ' . $day . "\n\n"
                . '- Día: ' . $time->format('d/m/Y') . "\n"
                . "- Zona horaria: Europe/Madrid\n"
                . '- Total de visitas: ' . $total . "\n"
                . '- Última visita: ' . $time->format('H:i:s P') . "\n\n"
                . "Una visita equivale a una sesión de navegación. Las recargas de la misma sesión no suman.\n\n"
                . "| Hora (Madrid) | Visita del día |\n| --- | --- |\n" . $rows;
            if (!rewind($file) || !ftruncate($file, 0)) throw new RuntimeException('Cannot update visit log');
            $length = strlen($markdown);
            $written = 0;
            while ($written < $length) {
                $bytes = fwrite($file, substr($markdown, $written));
                if ($bytes === false || $bytes === 0) throw new RuntimeException('Cannot write visit log');
                $written += $bytes;
            }
            if (!fflush($file)) throw new RuntimeException('Cannot flush visit log');
            return true;
        } finally {
            flock($file, LOCK_UN);
            fclose($file);
        }
    }
}

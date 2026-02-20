package org.itmo.isLab1.batchimport;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.itmo.isLab1.batchimport.dto.BatchImportResponseDto;
import org.itmo.isLab1.batchimport.exception.BatchImportException;
import org.itmo.isLab1.batchimport.service.BatchImportService;
import org.itmo.isLab1.common.minIO.MinioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Контроллер для пакетного импорта данных из файлов
 */
@Slf4j
@RestController
@RequestMapping(value = "/api/batch-import", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class BatchImportController {
    private final BatchImportService batchImportService;
    private final ObjectMapper objectMapper;
    private final MinioService minioService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<BatchImportResponseDto> importFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        String filePath = null;
        try {
            // Сохраняем файл в MinIO перед началом обработки
            filePath = minioService.uploadFile(file);
            log.info("Файл успешно загружен в MinIO: {}", filePath);
            
            // Парсим JSON из файла
            JsonNode jsonNode = objectMapper.readTree(file.getInputStream());
            
            // Передаем путь к файлу в сервис для обработки
            BatchImportResponseDto response = batchImportService.importBatch(jsonNode, filePath);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (IOException e) {
            // При ошибке парсинга удаляем файл из MinIO
            rollbackFileUpload(filePath);
            log.error("Ошибка при парсинге файла: {}", e.getMessage(), e);
            throw new BatchImportException("Failed to parse file: " + e.getMessage(), e);
        } catch (Exception e) {
            // При любой другой ошибке удаляем файл из MinIO
            rollbackFileUpload(filePath);
            log.error("Неожиданная ошибка при обработке файла: {}", e.getMessage(), e);
            throw new BatchImportException("Failed to process file: " + e.getMessage(), e);
        }
    }

    /**
     * Откатывает загрузку файла в MinIO при ошибке
     *
     * @param filePath путь к файлу в MinIO
     */
    private void rollbackFileUpload(String filePath) {
        if (filePath != null && !filePath.isEmpty()) {
            try {
                minioService.deleteFile(filePath);
                log.info("Файл успешно удален из MinIO при откате: {}", filePath);
            } catch (Exception e) {
                // Логируем ошибку, но не прерываем обработку
                // Файл может быть удален вручную администратором или через фоновые задачи
                log.warn("Не удалось удалить файл из MinIO при откате: {}. Причина: {}", filePath, e.getMessage());
            }
        }
    }
}


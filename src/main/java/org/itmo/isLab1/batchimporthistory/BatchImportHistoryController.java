package org.itmo.isLab1.batchimporthistory;

import lombok.RequiredArgsConstructor;

import org.itmo.isLab1.batchimporthistory.dto.BatchImportHistoryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/batch-import/history", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class BatchImportHistoryController {
    private final BatchImportHistoryService historyService;

    @GetMapping
    public ResponseEntity<Page<BatchImportHistoryDto>> getHistory(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<BatchImportHistoryDto> history = historyService.getHistory(pageable, true);
        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(history.getTotalElements()))
                .body(history);
    }
}


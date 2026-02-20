package org.itmo.isLab1.batchimport.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Map;

@Data
public class BatchOperationDto {
    public enum OperationType {
        CREATE, UPDATE, DELETE
    }

    public enum ResourceType {
        COORDINATES("coordinates"),
        CAVES("caves"),
        HEADS("heads"),
        DRAGONS("dragons"),
        LOCATIONS("locations"),
        PERSONS("persons");

        private final String value;

        ResourceType(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }

        public static ResourceType fromString(String value) {
            for (ResourceType type : ResourceType.values()) {
                if (type.value.equals(value)) {
                    return type;
                }
            }
            throw new IllegalArgumentException("Unknown resource type: " + value);
        }
    }

    @JsonProperty("type")
    private OperationType type;

    @JsonProperty("resourceType")
    private String resourceType;

    @JsonProperty("resourceId")
    private Integer resourceId;

    @JsonProperty("body")
    private Map<String, Object> body;
}


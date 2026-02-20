package org.itmo.isLab1.events.resources;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.HashMap;
import java.util.Map;

public enum ResourceType {
    @JsonProperty("admin-requests")
    ADMIN_REQUESTS("admin-requests"),
    @JsonProperty("batch-import-history")
    BATCH_IMPORT_HISTORY("batch-import-history"),
    @JsonProperty("coordinates")
    COORDINATES("coordinates"),
    @JsonProperty("caves")
    CAVES("caves"),
    @JsonProperty("heads")
    HEADS("heads"),
    @JsonProperty("dragons")
    DRAGONS("dragons"),
    @JsonProperty("locations")
    LOCATIONS("locations"),
    @JsonProperty("persons")
    PERSONS("persons");

    private static final Map<String, ResourceType> resources = new HashMap<>();

    static {
        for (ResourceType e: values()) {
            resources.put(e.resource, e);
        }
    }

    public final String resource;

    ResourceType(String resource) {
        this.resource = resource;
    }

    public static ResourceType valueOfResource(String label) {
        return resources.get(label);
    }
}
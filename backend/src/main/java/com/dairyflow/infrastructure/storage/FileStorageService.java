package com.dairyflow.infrastructure.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

public interface FileStorageService {

    String storeFile(MultipartFile file, String folder);

    String storeFile(InputStream inputStream, String filename, String contentType, long size, String folder);

    Resource loadFileAsResource(String filePath);

    void deleteFile(String filePath);

    String getFileUrl(String filePath);
}

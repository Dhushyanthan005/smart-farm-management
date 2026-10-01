package com.dairyflow.infrastructure.storage;

import com.dairyflow.common.exception.ApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@Service
public class LocalFileStorageService implements FileStorageService {

    private final Path fileStorageLocation;

    public LocalFileStorageService(@Value("${dairyflow.storage.local-dir:./data/uploads}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            log.error("Could not create the directory where uploaded files will be stored.", ex);
        }
    }

    @Override
    public String storeFile(MultipartFile file, String folder) {
        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        try {
            if (originalFilename.contains("..")) {
                throw new ApiException("Filename contains invalid path sequence " + originalFilename, HttpStatus.BAD_REQUEST, "INVALID_PATH");
            }
            String fileExtension = "";
            int extIndex = originalFilename.lastIndexOf(".");
            if (extIndex > 0) {
                fileExtension = originalFilename.substring(extIndex);
            }
            String uniqueFileName = UUID.randomUUID() + fileExtension;
            Path targetFolder = this.fileStorageLocation.resolve(folder != null ? folder : "general");
            Files.createDirectories(targetFolder);
            Path targetLocation = targetFolder.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return (folder != null ? folder + "/" : "") + uniqueFileName;
        } catch (IOException ex) {
            throw new ApiException("Could not store file " + originalFilename + ". Please try again!", HttpStatus.INTERNAL_SERVER_ERROR, "FILE_STORAGE_ERROR");
        }
    }

    @Override
    public String storeFile(InputStream inputStream, String filename, String contentType, long size, String folder) {
        try {
            String uniqueFileName = UUID.randomUUID() + "_" + filename;
            Path targetFolder = this.fileStorageLocation.resolve(folder != null ? folder : "general");
            Files.createDirectories(targetFolder);
            Path targetLocation = targetFolder.resolve(uniqueFileName);
            Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return (folder != null ? folder + "/" : "") + uniqueFileName;
        } catch (IOException ex) {
            throw new ApiException("Could not store stream file " + filename, HttpStatus.INTERNAL_SERVER_ERROR, "FILE_STORAGE_ERROR");
        }
    }

    @Override
    public Resource loadFileAsResource(String filePath) {
        try {
            Path targetPath = this.fileStorageLocation.resolve(filePath).normalize();
            Resource resource = new UrlResource(targetPath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new ApiException("File not found: " + filePath, HttpStatus.NOT_FOUND, "FILE_NOT_FOUND");
            }
        } catch (MalformedURLException ex) {
            throw new ApiException("File path error: " + filePath, HttpStatus.BAD_REQUEST, "INVALID_FILE_PATH");
        }
    }

    @Override
    public void deleteFile(String filePath) {
        try {
            Path targetPath = this.fileStorageLocation.resolve(filePath).normalize();
            Files.deleteIfExists(targetPath);
        } catch (IOException ex) {
            log.warn("Could not delete file {}: {}", filePath, ex.getMessage());
        }
    }

    @Override
    public String getFileUrl(String filePath) {
        return "/api/v1/files/" + filePath;
    }
}

package com.foodshare.service;

import com.foodshare.exception.ValidationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Service
public class FileUploadService {

    @Value("${upload.path:uploads}")
    private String uploadPath;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;
    private static final Set<String> ALLOWED_EXTENSIONS = new HashSet<>(Arrays.asList("jpg", "jpeg", "png"));

    public String uploadFile(MultipartFile file, Long userId) {
        if (file.isEmpty()) {
            throw new ValidationException("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ValidationException("File size exceeded. Maximum size is 5MB");
        }

        String originalFileName = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFileName);

        if (!ALLOWED_EXTENSIONS.contains(fileExtension.toLowerCase())) {
            throw new ValidationException("Invalid file type. Allowed types: jpg, jpeg, png");
        }

        try {
            String uploadDir = uploadPath + File.separator + userId;
            Files.createDirectories(Paths.get(uploadDir));

            String fileName = System.currentTimeMillis() + "." + fileExtension;
            Path filePath = Paths.get(uploadDir, fileName);

            file.transferTo(filePath);

            return uploadDir + File.separator + fileName;
        } catch (IOException e) {
            throw new ValidationException("Failed to upload file: " + e.getMessage());
        }
    }

    private String getFileExtension(String fileName) {
        int lastIndex = fileName.lastIndexOf('.');
        if (lastIndex > 0) {
            return fileName.substring(lastIndex + 1);
        }
        return "";
    }
}

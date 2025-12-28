package pl.edu.agh.to.bgg.boardgame;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.multipart.MultipartFile;

public record BoardGameCreateDTO(
        @NotBlank(message = "Title must not be blank")
        String title,

        String description,

        @Min(value = 1, message = "minPlayers must be at least 1")
        int minPlayers,

        @Min(value = 1, message = "maxPlayers must be at least 1")
        int maxPlayers,

        @Min(value = 1, message = "minutesPlaytime must be at least 1")
        int minutesPlaytime,

        MultipartFile image,

        MultipartFile pdfInstruction
) {
    @AssertTrue(message = "maxPlayers must be greater than or equal to minPlayers")
    public boolean isPlayersRangeValid() {
        return maxPlayers >= minPlayers;
    }

    @AssertTrue(message = "Image max size is 2MB and image format")
    public boolean isImageValid() {
        if (image == null || image.isEmpty()) return true;
        String contentType = image.getContentType();

        long maxSize = 2 * 1024 * 1024; // 2 MB
        return (contentType != null && contentType.startsWith("image/") && image.getSize() <= maxSize);
    }

    @AssertTrue(message = "PDF instruction max size it 5 MB and in PDF format ")
    public boolean isPdfInstructionValid() {
        if (pdfInstruction == null || pdfInstruction.isEmpty()) return true;
        String contentType = pdfInstruction.getContentType();

        long maxSize = 5 * 1024 * 1024; // 5 MB
        return ("application/pdf".equals(contentType) && pdfInstruction.getSize() <= maxSize);
    }
}

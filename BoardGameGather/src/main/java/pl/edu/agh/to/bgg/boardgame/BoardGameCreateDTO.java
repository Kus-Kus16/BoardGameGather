package pl.edu.agh.to.bgg.boardgame;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record BoardGameCreateDTO(
        @NotBlank
        String title,

        String description,

        @Min(value = 1)
        int minPlayers,

        @Min(value = 1)
        int maxPlayers,

        @Min(value = 1)
        int minutesPlaytime) {
}

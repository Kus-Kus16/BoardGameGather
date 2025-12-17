package pl.edu.agh.to.bgg.session;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record GameSessionCreateDTO(
        @NotNull
        @Min(1)
        int boardGameId,

        @NotBlank
        String ownerUsername,

        LocalDate date,

        @NotNull
        @Min(1)
        int numberOfPlayers,

        String description){
}

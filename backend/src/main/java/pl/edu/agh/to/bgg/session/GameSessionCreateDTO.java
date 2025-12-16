package pl.edu.agh.to.bgg.session;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record GameSessionCreateDTO(
        @NotBlank
        int boardGameId,

        @NotBlank
        String ownerUsername,

        @NotBlank
        LocalDate date,

        @NotBlank
        int numberOfPlayers,

        String description){
}

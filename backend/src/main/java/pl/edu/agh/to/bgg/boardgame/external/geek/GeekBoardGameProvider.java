package pl.edu.agh.to.bgg.boardgame.external.geek;

import org.springframework.stereotype.Service;
import pl.edu.agh.to.bgg.boardgame.BoardGame;
import pl.edu.agh.to.bgg.boardgame.external.ExternalBoardGameEntry;
import pl.edu.agh.to.bgg.boardgame.external.ExternalBoardGameProvider;
import pl.edu.agh.to.bgg.boardgame.external.geek.dto.GeekBoardGameDetailsDTO;
import pl.edu.agh.to.bgg.exception.BoardGameNotFoundException;
import pl.edu.agh.to.bgg.file.StoredFile;
import pl.edu.agh.to.bgg.file.StoredFileService;

import java.util.List;

@Service
public class GeekBoardGameProvider implements ExternalBoardGameProvider {
    private final ApiClient apiClient;
    private final StoredFileService storedFileService;

    public GeekBoardGameProvider(ApiClient apiClient, StoredFileService storedFileService) {
        this.apiClient = apiClient;
        this.storedFileService = storedFileService;
    }

    @Override
    public List<ExternalBoardGameEntry> searchFor(String query) {
        return apiClient.searchFor(query)
                .stream()
                .map(geekEntry -> new ExternalBoardGameEntry(
                        geekEntry.objectId(),
                        geekEntry.name(),
                        geekEntry.yearPublished()
                ))
                .toList();
    }

    @Override
    public BoardGame getById(int externalId) {
        GeekBoardGameDetailsDTO dto = apiClient.getById(externalId)
                .orElseThrow(BoardGameNotFoundException::new);

        BoardGame boardGame = new BoardGame(
                dto.name(),
                dto.description(),
                dto.minPlayers(),
                dto.maxPlayers(),
                dto.playingTime()
        );

        if (dto.image() != null) {
            byte[] imageBytes = apiClient.getImage(dto.image());
            StoredFile imageFile = storedFileService.saveFile(dto.name(), "image/jpeg", imageBytes, imageBytes.length);
            boardGame.setImageFile(imageFile);
        }

        return boardGame;
    }
}

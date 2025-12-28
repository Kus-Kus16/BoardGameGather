package pl.edu.agh.to.bgg.boardgame;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class BoardGameService {

    @Value("${app.image-storage-path}")
    private String imageStoragePath;

    @Value("${app.pdf-storage-path}")
    private String pdfStoragePath;

    private final BoardGameRepository boardGameRepository;

    public BoardGameService(BoardGameRepository boardGameRepository) {
        this.boardGameRepository = boardGameRepository;
    }

    public List<BoardGame> getBoardGames() {
        return boardGameRepository.findAll();
    }

    public BoardGame getBoardGame(int id) throws BoardGameNotFoundException {
        return boardGameRepository
                .findById(id)
                .orElseThrow(BoardGameNotFoundException::new);
    }

    @Transactional
    public BoardGame addBoardGame(BoardGameCreateDTO dto) throws IllegalArgumentException, IOException {

        BoardGame boardGame = new BoardGame(
                dto.title(),
                dto.description(),
                dto.minPlayers(),
                dto.maxPlayers(),
                dto.minutesPlaytime()
        );

        if (dto.image() != null && !dto.image().isEmpty()) {
            String path = imageStoragePath + "/" + dto.image().getOriginalFilename() + "_" + UUID.randomUUID();
            dto.image().transferTo(new File(path));
            boardGame.setImageUrl(path);
        }

        if (dto.pdfInstruction() != null && !dto.pdfInstruction().isEmpty()) {
            String path = pdfStoragePath + "/" + dto.pdfInstruction().getOriginalFilename() + "_" + UUID.randomUUID();
            dto.pdfInstruction().transferTo(new File(path));
            boardGame.setPdfUrl(path);
        }

        return boardGameRepository.save(boardGame);
    }

    @Transactional
    public void deleteBoardGame(int boardGameId) throws BoardGameNotFoundException {
        boardGameRepository
                .findById(boardGameId)
                .orElseThrow(BoardGameNotFoundException::new);

        boardGameRepository.deleteById(boardGameId);
    }
}

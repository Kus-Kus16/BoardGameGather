package pl.edu.agh.to.bgg;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;
import pl.edu.agh.to.bgg.boardgame.BoardGame;
import pl.edu.agh.to.bgg.boardgame.BoardGameRepository;

import java.util.List;

@Configuration
public class DatabaseCreator {
    private final BoardGameRepository boardGameRepository;

    public DatabaseCreator(BoardGameRepository boardGameRepository) {
        this.boardGameRepository = boardGameRepository;
    }

    @PostConstruct
    public void init() {
        BoardGame bg1 = new BoardGame(
                "7 cudów świata",
                "Ciekawa gra",
                2,
                7,
                30
        );

        BoardGame bg2 = new BoardGame(
                "Robinson Crusoe",
                "Ciekawa gra",
                1,
                4,
                90
        );

        boardGameRepository.saveAll(List.of(bg1, bg2));
    }
}

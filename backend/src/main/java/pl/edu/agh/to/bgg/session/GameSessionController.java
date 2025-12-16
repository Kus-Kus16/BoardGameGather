package pl.edu.agh.to.bgg.session;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import pl.edu.agh.to.bgg.boardgame.BoardGameNotFoundException;
import pl.edu.agh.to.bgg.user.UserNotFoundException;
import pl.edu.agh.to.bgg.user.UserRequestDTO;

import java.util.List;

@RestController
@RequestMapping("sessions")
@CrossOrigin(origins = "http://localhost:5173")
public class GameSessionController {
    private final GameSessionService gameSessionService;

    public GameSessionController(GameSessionService gameSessionService) {
        this.gameSessionService = gameSessionService;
    }

    @GetMapping
    public List<GameSession> getSessions() {
        return gameSessionService.getSessions();
    }

    @GetMapping("{id}")
    public GameSession getSession(@PathVariable("id") int sessionId) {
        try {
            return gameSessionService.getSession(sessionId);
        } catch (GameSessionNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/user")
    public List<GameSession> getUserSessions(@RequestBody @Valid UserRequestDTO userDTO) {
        return gameSessionService.getUserSessions(userDTO.username());
    }

    @PostMapping("{id}/join")
    public GameSession joinSession(@PathVariable("id") int sessionId, @RequestBody @Valid UserRequestDTO userDTO) {
        try {
            return gameSessionService.joinSession(sessionId, userDTO.username());
        } catch (GameSessionNotFoundException | UserNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PostMapping("/add")
    public GameSession createSession(@RequestBody @Valid GameSessionCreateDTO dto) {
        try {
            return gameSessionService.addSession(dto);
        } catch (BoardGameNotFoundException | UserNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}

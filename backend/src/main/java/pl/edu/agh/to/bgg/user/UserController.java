package pl.edu.agh.to.bgg.user;

import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import pl.edu.agh.to.bgg.exception.UserNotFoundException;
import pl.edu.agh.to.bgg.exception.UsernameAlreadyExistsException;

@RestController
@RequestMapping("users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public User registerUser(@RequestHeader("X-User-Login") @NotBlank String username) {
        return userService.addUser(username);
    }

    @PostMapping("login")
    public User loginUser(@RequestHeader("X-User-Login") @NotBlank String username) {
        return userService.getUser(username);
    }
}

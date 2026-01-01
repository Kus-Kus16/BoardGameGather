package pl.edu.agh.to.bgg.user;

import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

package pl.edu.agh.to.bgg.user;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User addUser(String username) throws IllegalArgumentException, UsernameAlreadyExistsException {
        if (username == null || username.isEmpty()) {
            throw new IllegalArgumentException("Username is null or empty");
        }

        try {
            User user = new User(username);
            return userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new UsernameAlreadyExistsException();
        }
    }

    public User getUser(String username) throws UserNotFoundException {
        return userRepository
                .findByUsername(username)
                .orElseThrow(UserNotFoundException::new);
    }
}

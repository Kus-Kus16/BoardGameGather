package pl.edu.agh.to.bgg.session;

import jakarta.persistence.*;
import pl.edu.agh.to.bgg.boardgame.BoardGame;
import pl.edu.agh.to.bgg.user.User;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class GameSession {
    @Id
    @GeneratedValue
    private int id;

    private LocalDate date;
    private int numberOfPlayers;
    private String description;

    @ManyToOne
    private BoardGame boardGame;

    @ManyToOne
    private User owner;

    @ManyToMany
    private final List<User> participants = new ArrayList<>();


    public GameSession(LocalDate date, int numberOfPlayers, String description, BoardGame boardGame, User owner) {
        this.date = date;
        this.numberOfPlayers = numberOfPlayers;
        this.description = description;
        this.boardGame = boardGame;
        this.owner = owner;
    }

    public GameSession() {

    }

    public int getId() {
        return id;
    }

    public BoardGame getBoardGame() {
        return boardGame;
    }

    public LocalDate getDate() {
        return date;
    }

    public int getNumberOfPlayers() {
        return numberOfPlayers;
    }

    public String getDescription() {
        return description;
    }

    public User getOwner() {
        return owner;
    }

    public List<User> getParticipants() {
        return participants;
    }
}

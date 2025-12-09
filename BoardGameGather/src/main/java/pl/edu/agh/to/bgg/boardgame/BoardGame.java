package pl.edu.agh.to.bgg.boardgame;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class BoardGame {
    @Id
    @GeneratedValue
    private int id;

    private String title;
    private String description;
    private int minPlayers;
    private int maxPlayers;
    private int minutesPlaytime;

    public BoardGame(String title, String description, int minPlayers, int maxPlayers, int minutesPlaytime) {
        this.title = title;
        this.description = description;
        this.minPlayers = minPlayers;
        this.maxPlayers = maxPlayers;
        this.minutesPlaytime = minutesPlaytime;
    }

    public BoardGame() {

    }

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public int getMinPlayers() {
        return minPlayers;
    }

    public int getMaxPlayers() {
        return maxPlayers;
    }

    public int getMinutesPlaytime() {
        return minutesPlaytime;
    }
}

package pl.edu.agh.to.bgg.user;

import jakarta.persistence.*;

@Entity
@Table(name = "app_user")
public class User {
    @Id
    @GeneratedValue
    private int id;

    @Column(unique = true, nullable = false)
    private String username;

    public User(String username) {
        this.username = username;
    }

    public User() {

    }

    public int getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }
}

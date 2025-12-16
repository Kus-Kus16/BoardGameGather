package pl.edu.agh.to.bgg.session;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameSessionRepository extends JpaRepository<GameSession, Integer> {
    List<GameSession> findByOwner_Username(String username);

    @Query("SELECT s FROM GameSession s " +
            "LEFT JOIN FETCH s.participants " +
            "JOIN FETCH s.owner " +
            "JOIN FETCH s.boardGame " +
            "WHERE s.id = :id")
    Optional<GameSession> findByIdWithDetails(@Param("id") int id);
}

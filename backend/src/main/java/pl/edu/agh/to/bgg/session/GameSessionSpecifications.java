package pl.edu.agh.to.bgg.session;

import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import pl.edu.agh.to.bgg.boardgame.BoardGame;
import pl.edu.agh.to.bgg.user.User;
import java.util.function.BiFunction;

public class GameSessionSpecifications {

    public static Specification<GameSession> hasParticipantUsername(String username) {
        return (gameSessionRoot, query, cb) -> {
            if (username == null || username.isBlank()) {
                return cb.conjunction();
            }

            query.distinct(true);

            Join<GameSession, User> participants = gameSessionRoot.join("participants", JoinType.LEFT);
            return cb.equal(participants.get("username"), username);
        };
    }

    public static Specification<GameSession> containsBoardGameTitle(String title) {
        return (gameSessionRoot, query, cb) -> {
            if (title == null || title.isBlank()) {
                return cb.conjunction();
            }

            String pattern = "%" + title.toLowerCase() + "%";

            query.distinct(true);

            return matchSelectedOrBoardGames(
                    gameSessionRoot,
                    cb,
                    (selectedBoardGame, boardGames) ->
                            titleMatchPredicates(cb, selectedBoardGame, boardGames, pattern)
            );
        };
    }

    public static Specification<GameSession> hasMaximumPlaytime(Integer maxMinutesPlaytime) {
        return (gameSessionRoot, query, cb) -> {
            if (maxMinutesPlaytime == null) {
                return cb.conjunction();
            }

            query.distinct(true);

            return matchSelectedOrBoardGames(
                    gameSessionRoot,
                    cb,
                    (selectedBoardGame, boardGames) ->
                            minutesPlaytimeMatchPredicates(cb, selectedBoardGame, boardGames, maxMinutesPlaytime)
            );
        };
    }

    public static Specification<GameSession> hasMinimumPlayers(Integer minimumPlayers) {
        return (gameSessionRoot, query, cb) -> {
            if (minimumPlayers == null) {
                return cb.conjunction();
            }

            return cb.greaterThanOrEqualTo(gameSessionRoot.get("numberOfPlayers"), minimumPlayers);
        };
    }

    public static Specification<GameSession> hasMaximumPlayers(Integer maximumPlayers) {
        return (gameSessionRoot, query, cb) -> {
            if (maximumPlayers == null) {
                return cb.conjunction();
            }

            return cb.lessThanOrEqualTo(gameSessionRoot.get("numberOfPlayers"), maximumPlayers);
        };
    }

    private static Predicate matchSelectedOrBoardGames(
            Root<GameSession> root,
            CriteriaBuilder cb,
            BiFunction<Join<GameSession, BoardGame>, Join<GameSession, BoardGame>, PredicatePair> matchPredicates
    ) {
        Join<GameSession, BoardGame> selectedBoardGame = root.join("selectedBoardGame", JoinType.LEFT);
        Join<GameSession, BoardGame> boardGames = root.join("boardGames");

        Predicate hasSelected = cb.isNotNull(root.get("selectedBoardGame"));
        PredicatePair pair = matchPredicates.apply(selectedBoardGame, boardGames);

        return cb.or(
                cb.and(hasSelected, pair.selectedBoardGameMatch()),
                cb.and(cb.not(hasSelected), pair.boardGameMatch())
        );
    }

    private static PredicatePair titleMatchPredicates(
            CriteriaBuilder cb,
            Join<GameSession, BoardGame> selectedBoardGame,
            Join<GameSession, BoardGame> boardGames,
            String pattern
    ) {
        Predicate selectedBoardGameMatch = cb.like(cb.lower(selectedBoardGame.get("title")), pattern);
        Predicate boardGameMatch = cb.like(cb.lower(boardGames.get("title")), pattern);

        return new PredicatePair(selectedBoardGameMatch, boardGameMatch);
    }

    private static PredicatePair minutesPlaytimeMatchPredicates(
            CriteriaBuilder cb,
            Join<GameSession, BoardGame> selectedBoardGame,
            Join<GameSession, BoardGame> boardGames,
            int maxMinutesPlaytime
    ) {
        Predicate selectedBoardGameMatch = cb.lessThanOrEqualTo(selectedBoardGame.get("minutesPlaytime"), maxMinutesPlaytime);
        Predicate boardGameMatch = cb.lessThanOrEqualTo(boardGames.get("minutesPlaytime"), maxMinutesPlaytime);

        return new PredicatePair(selectedBoardGameMatch, boardGameMatch);
    }

    private record PredicatePair(
            Predicate selectedBoardGameMatch,
            Predicate boardGameMatch
    ) {}
}
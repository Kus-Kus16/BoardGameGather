import type { VoteType } from "../types/VoteType";
import type {GameSessionTypeFull} from "../types/GameSessionType.ts";
import {Card, CardContent, Chip, Stack, Typography } from "@mui/material";

export default function VotingSection({ session }: { session: GameSessionTypeFull }) {
    const getVotesForGame = (gameId: number) =>
        session.votes.filter(v => v.gameId === gameId);

    const countVotes = (votes: VoteType[]) => ({
        likes: votes.filter(v => v.isLiked).length,
        known: votes.filter(v => v.isKnown).length,
    });

    return (
        <Stack spacing={2}>
            <Typography variant="h5">
                Głosowanie
            </Typography>

            {session.boardGames.map(game => {
                // const votes = getVotesForGame(game.id);
                // const { likes, known } = countVotes(votes);
                const likes = 5;
                const known = 2;

                return (
                    <Card key={game.id} variant="outlined">
                        <CardContent>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Typography>{game.title}</Typography>

                                <Stack direction="row" spacing={2}>
                                    <Chip label={`Likes ${likes}`} color="success" />
                                    <Chip label={`Known ${known}`} />
                                </Stack>
                            </Stack>
                        </CardContent>

                        {/* tu przyciski głosowania */}
                    </Card>
                );
            })}
        </Stack>
    );
}

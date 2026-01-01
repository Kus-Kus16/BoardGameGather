package pl.edu.agh.to.bgg.exception;

public class BoardGameNotFoundException extends NotFoundException {

    public BoardGameNotFoundException() {
        super("Board game not found");
    }
}

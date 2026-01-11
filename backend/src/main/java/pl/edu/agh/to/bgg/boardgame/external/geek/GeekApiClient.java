package pl.edu.agh.to.bgg.boardgame.external.geek;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import pl.edu.agh.to.bgg.boardgame.external.geek.dto.GeekBoardGameDetailsDTO;
import pl.edu.agh.to.bgg.boardgame.external.geek.dto.GeekBoardGameEntryDTO;

import java.util.List;
import java.util.Optional;

@Service
public class GeekApiClient implements ApiClient {
    private static class GeekBoardGameEntryDTOList {
        @JacksonXmlElementWrapper(useWrapping = false)
        @JacksonXmlProperty(localName = "boardgame") // todo ??
        private List<GeekBoardGameEntryDTO> boardgames;

        public List<GeekBoardGameEntryDTO> getBoardgames() {
            return boardgames;
        }

        public void setBoardgames(List<GeekBoardGameEntryDTO> boardgames) {
            this.boardgames = boardgames;
        }
    }

    private final static String URL = "https://boardgamegeek.com/xmlapi2/";
    private final RestClient restClient = RestClient.create();

    @Override
    public List<GeekBoardGameEntryDTO> searchFor(String query) {
        GeekBoardGameEntryDTOList response = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path(URL)
                        .path("search")
                        .queryParam("query", query)
                        .queryParam("type", "boardgame")
                        .build())
                .accept(MediaType.APPLICATION_XML)
                .retrieve()
                .body(GeekBoardGameEntryDTOList.class);

        return response.getBoardgames();
    }

    @Override
    public Optional<GeekBoardGameDetailsDTO> getById(int id) {
        GeekBoardGameDetailsDTO response = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path(URL)
                        .path("thing")
                        .queryParam("id", id)
                        .queryParam("type", "boardgame")
                        .build())
                .accept(MediaType.APPLICATION_XML)
                .retrieve()
                .body(GeekBoardGameDetailsDTO.class);

        return Optional.ofNullable(response);
    }

    @Override
    public byte[] getImage(String imageUrl) {
        return restClient.get()
                .uri(imageUrl)
                .accept(MediaType.APPLICATION_OCTET_STREAM)
                .retrieve()
                .body(byte[].class);
    }

}



package pl.edu.agh.to.bgg.boardgame.external.geek;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import pl.edu.agh.to.bgg.boardgame.external.geek.dto.GeekSearchResponseDTO;
import pl.edu.agh.to.bgg.boardgame.external.geek.dto.GeekThingResponseDTO;

import java.util.List;
import java.util.Optional;

@Service
public class GeekApiClient {
    private final static String BASE_URL = "https://boardgamegeek.com/xmlapi2/";
    private final String geekToken;
    private final RestClient restClient;

    public GeekApiClient(@Value("${app.external-token}") String geekToken) {
        this.geekToken = geekToken;
        this.restClient = RestClient.builder()
                .baseUrl(BASE_URL)
                .build();
    }

    public GeekSearchResponseDTO searchFor(String query) {
        GeekSearchResponseDTO response = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("search")
                        .queryParam("query", query)
                        .queryParam("type", "boardgame")
                        .build())
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + geekToken)
                .accept(MediaType.APPLICATION_XML)
                .retrieve()
                .body(GeekSearchResponseDTO.class);

        if (response == null || response.isEmpty()) {
            return new GeekSearchResponseDTO(List.of());
        }

        return response;
    }

    public Optional<GeekThingResponseDTO.ItemDetails> getById(int id) {
        GeekThingResponseDTO response = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("thing")
                        .queryParam("id", id)
                        .queryParam("type", "boardgame")
                        .build())
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + geekToken)
                .accept(MediaType.APPLICATION_XML)
                .retrieve()
                .body(GeekThingResponseDTO.class);

        if (response == null || response.isEmpty()) {
            return Optional.empty();
        }

        return Optional.ofNullable(response.getItem());
    }
}



# Integração com Spring Boot Backend

Este documento descreve como o frontend React se integra com o backend Spring Boot.

## Arquitetura

```
Frontend (React/TypeScript)
    ↓
Services Layer (api.ts, auth.service.ts, etc.)
    ↓
API Client (fetch)
    ↓
Spring Boot Backend
    ↓
PostgreSQL Database
```

## Estrutura do Backend Spring Boot

### 1. Estrutura de Pacotes Recomendada

```
src/main/java/br/com/zanza/
├── ZanzaApplication.java
├── config/
│   ├── SecurityConfig.java
│   ├── CorsConfig.java
│   └── JwtConfig.java
├── controller/
│   ├── AuthController.java
│   ├── UserController.java
│   ├── StreetController.java
│   ├── ReviewController.java
│   ├── RouteController.java
│   └── CommunityController.java
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── CreateReviewRequest.java
│   │   └── RouteRequest.java
│   └── response/
│       ├── AuthResponse.java
│       ├── ApiResponse.java
│       ├── UserStatsResponse.java
│       └── CommunityStatsResponse.java
├── entity/
│   ├── User.java
│   ├── Street.java
│   ├── StreetReview.java
│   ├── Route.java
│   └── PointOfInterest.java
├── repository/
│   ├── UserRepository.java
│   ├── StreetRepository.java
│   ├── StreetReviewRepository.java
│   ├── RouteRepository.java
│   └── PointOfInterestRepository.java
├── service/
│   ├── AuthService.java
│   ├── UserService.java
│   ├── StreetService.java
│   ├── ReviewService.java
│   ├── RouteService.java
│   └── CommunityService.java
├── security/
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── UserDetailsServiceImpl.java
└── exception/
    ├── GlobalExceptionHandler.java
    ├── ResourceNotFoundException.java
    └── UnauthorizedException.java
```

## Endpoints da API

### Autenticação

#### POST /api/auth/register
```java
@PostMapping("/api/auth/register")
public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody RegisterRequest request) {
    // Validação
    // Criar usuário
    // Gerar token JWT
    // Retornar resposta
}
```

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@example.com",
      "level": 1,
      "totalReviews": 0,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### POST /api/auth/login
```java
@PostMapping("/api/auth/login")
public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
    // Autenticar
    // Gerar token
    // Retornar resposta
}
```

#### GET /api/auth/me
```java
@GetMapping("/api/auth/me")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<ApiResponse<User>> getCurrentUser(Authentication authentication) {
    // Retornar usuário atual
}
```

### Ruas e Avaliações

#### GET /api/streets
```java
@GetMapping("/api/streets")
public ResponseEntity<ApiResponse<Page<Street>>> getStreets(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @RequestParam(required = false) List<String> neighborhoods,
    @RequestParam(required = false) List<String> safetyLevels
) {
    // Buscar ruas com filtros
}
```

#### GET /api/streets/{id}
```java
@GetMapping("/api/streets/{id}")
public ResponseEntity<ApiResponse<Street>> getStreetById(@PathVariable String id) {
    // Buscar rua por ID
}
```

#### GET /api/streets/nearby
```java
@GetMapping("/api/streets/nearby")
public ResponseEntity<ApiResponse<List<Street>>> getNearbyStreets(
    @RequestParam double lat,
    @RequestParam double lng,
    @RequestParam(defaultValue = "1000") int radius
) {
    // Buscar ruas próximas usando PostGIS
}
```

#### POST /api/reviews
```java
@PostMapping("/api/reviews")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<ApiResponse<StreetReview>> createReview(
    @RequestBody CreateReviewRequest request,
    Authentication authentication
) {
    // Criar avaliação
    // Atualizar estatísticas da rua
    // Calcular nível do usuário
}
```

### Rotas

#### POST /api/routes/calculate
```java
@PostMapping("/api/routes/calculate")
public ResponseEntity<ApiResponse<Route>> calculateRoute(@RequestBody RouteRequest request) {
    // Calcular rota mais segura
    // Considerar avaliações das ruas
    // Aplicar algoritmo de pathfinding
}
```

### Comunidade

#### GET /api/community/stats
```java
@GetMapping("/api/community/stats")
public ResponseEntity<ApiResponse<CommunityStats>> getCommunityStats() {
    // Retornar estatísticas gerais
}
```

#### GET /api/community/neighborhoods/top
```java
@GetMapping("/api/community/neighborhoods/top")
public ResponseEntity<ApiResponse<List<Neighborhood>>> getTopNeighborhoods(
    @RequestParam(defaultValue = "10") int limit
) {
    // Retornar bairros mais seguros
}
```

## Modelos de Entidade

### User.java
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(generator = "UUID")
    private UUID id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password; // BCrypt hashed
    
    @Column(nullable = false)
    private Integer level = 1;
    
    @Column(nullable = false)
    private Integer totalReviews = 0;
    
    @OneToMany(mappedBy = "user")
    private List<StreetReview> reviews;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

### Street.java
```java
@Entity
@Table(name = "streets")
public class Street {
    @Id
    @GeneratedValue(generator = "UUID")
    private UUID id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String neighborhood;
    
    @Column(nullable = false)
    private String city;
    
    @Enumerated(EnumType.STRING)
    private SafetyLevel safetyLevel;
    
    @Column(nullable = false)
    private Double averageRating = 0.0;
    
    @Column(nullable = false)
    private Integer totalReviews = 0;
    
    @Column(columnDefinition = "geometry(Point,4326)")
    private Point coordinates; // PostGIS Point
    
    @OneToMany(mappedBy = "street")
    private List<StreetReview> reviews;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

### StreetReview.java
```java
@Entity
@Table(name = "street_reviews")
public class StreetReview {
    @Id
    @GeneratedValue(generator = "UUID")
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "street_id", nullable = false)
    private Street street;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private Integer rating; // 1-5
    
    @ElementCollection
    private List<String> issues;
    
    @Column(columnDefinition = "TEXT")
    private String comment;
    
    @Enumerated(EnumType.STRING)
    private TimeOfDay timeOfDay;
    
    @Column(columnDefinition = "geometry(Point,4326)")
    private Point coordinates;
    
    @CreatedDate
    private LocalDateTime createdAt;
}
```

## Configuração de Segurança

### SecurityConfig.java
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf().disable()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/streets/**").permitAll()
                .requestMatchers("/api/routes/**").permitAll()
                .requestMatchers("/api/community/**").permitAll()
                .requestMatchers("/api/reviews/**").authenticated()
                .anyRequest().authenticated()
            .and()
            .addFilterBefore(jwtAuthenticationFilter(), 
                UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

### CorsConfig.java
```java
@Configuration
public class CorsConfig {
    
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
}
```

## Dependências Maven

### pom.xml
```xml
<dependencies>
    <!-- Spring Boot -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <!-- PostgreSQL -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>
    
    <!-- PostGIS for geospatial queries -->
    <dependency>
        <groupId>net.postgis</groupId>
        <artifactId>postgis-jdbc</artifactId>
        <version>2023.1.0</version>
    </dependency>
    
    <dependency>
        <groupId>org.hibernate.orm</groupId>
        <artifactId>hibernate-spatial</artifactId>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.3</version>
    </dependency>
    
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.3</version>
        <scope>runtime</scope>
    </dependency>
    
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.12.3</version>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```

## application.properties
```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/zanza
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.spatial.dialect.postgis.PostgisPG95Dialect

# JWT
jwt.secret=your-secret-key-change-in-production
jwt.expiration=86400000

# Server
server.port=8080

# CORS
cors.allowed-origins=http://localhost:3000,http://localhost:5173
```

## Scripts SQL

### Criar Database com PostGIS
```sql
CREATE DATABASE zanza;

\c zanza

CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;
```

### Índices Espaciais
```sql
CREATE INDEX idx_streets_coordinates ON streets USING GIST (coordinates);
CREATE INDEX idx_reviews_coordinates ON street_reviews USING GIST (coordinates);
```

## Testes de Integração

Os serviços frontend estão prontos para:

1. **Autenticação JWT**: Token é automaticamente incluído em todas as requisições autenticadas
2. **Tratamento de Erros**: Erros 401 redirecionam para login
3. **Refresh Token**: Suporte para renovação automática de tokens
4. **Modo Offline**: Cache local com localStorage
5. **Geolocalização**: Integração nativa com dispositivos Android

## Próximos Passos

1. Implementar backend Spring Boot seguindo esta estrutura
2. Configurar PostgreSQL com PostGIS
3. Implementar autenticação JWT
4. Criar endpoints REST conforme especificado
5. Testar integração com frontend
6. Deploy em produção

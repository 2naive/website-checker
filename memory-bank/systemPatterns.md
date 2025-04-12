# System Patterns

## Architecture
- Client-Server architecture
- REST API for communication
- Modular check system
- Event-driven processing

## Key Components
1. Server (`server.js`)
   - HTTP server
   - API endpoints
   - Request handling
   - Response formatting

2. Parser (`src/parser.js`)
   - Website analysis
   - Puppeteer integration
   - Data extraction
   - Error handling

3. Auditor (`src/auditor.js`)
   - Check management
   - Result processing
   - Report generation

## Design Patterns
1. Factory Pattern
   - Check creation
   - Parser initialization

2. Observer Pattern
   - Event handling
   - Progress updates

3. Strategy Pattern
   - Different check types
   - Analysis methods

## Data Flow
1. Request received
2. URL validation
3. Parser initialization
4. Check execution
5. Result processing
6. Response generation

## Error Handling
- Graceful degradation
- Detailed error messages
- Logging system
- Recovery mechanisms 
# mcp-radio

MCP server for internet radio station search via [Radio Browser](https://www.radio-browser.info/). Free, no auth required.

## Tools

| Tool | Description |
|------|-------------|
| `search_stations` | Search radio stations by name, ordered by popularity |
| `get_top_stations` | Get most popular stations globally or by country |
| `list_countries` | List countries with their station counts |
| `list_tags` | List top genres/tags by station count |

## Quickstart (Pipeworx Gateway)

```bash
curl -X POST https://gateway.pipeworx.io/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "radio_search_stations",
      "arguments": { "query": "BBC" }
    },
    "id": 1
  }'
```

## License

MIT

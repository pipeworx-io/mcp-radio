# mcp-radio

Radio MCP — wraps Radio Browser API (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search_stations` | Search radio stations by name. Returns station name, URL, country, genres, and popularity vote count. Use when looking for a specific station or browsing by keyword. |
| `get_top_stations` | Get trending radio stations ranked by popularity, optionally filtered by country (e.g., 'US', 'GB', 'DE'). Returns station URLs, genres, and vote counts. |
| `list_countries` | Browse available countries with radio stations. Returns country names and station counts to help target your search geographically. |
| `list_tags` | Discover radio genres and tags ranked by station count. Use to explore what categories are available before searching. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "radio": {
      "url": "https://gateway.pipeworx.io/radio/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Radio data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

/**
 * Radio MCP — wraps Radio Browser API (free, no auth)
 *
 * Tools:
 * - search_stations: Search radio stations by name
 * - get_top_stations: Get most-voted stations globally or by country
 * - list_countries: List countries with their station counts
 * - list_tags: List top genres/tags by station count
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://de1.api.radio-browser.info/json';

type RawStation = {
  name: string;
  url: string;
  url_resolved?: string;
  country: string;
  language: string;
  tags: string;
  votes: number;
  codec: string;
  bitrate: number;
};

type RawCountry = {
  name: string;
  stationcount: number;
};

type RawTag = {
  name: string;
  stationcount: number;
};

function formatStation(s: RawStation) {
  return {
    name: s.name,
    url: s.url_resolved || s.url,
    country: s.country,
    language: s.language,
    tags: s.tags,
    votes: s.votes,
    codec: s.codec,
    bitrate: s.bitrate,
  };
}

const tools: McpToolExport['tools'] = [
  {
    name: 'search_stations',
    description: 'Search for radio stations by name. Results are ordered by votes (popularity).',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Station name to search for.',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return. Defaults to 10.',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_top_stations',
    description:
      'Get the most popular radio stations by vote count, optionally filtered by country.',
    inputSchema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          description: 'Number of stations to return. Defaults to 10.',
        },
        country: {
          type: 'string',
          description:
            'Filter by country name (e.g. "Germany", "United States"). Omit for global results.',
        },
      },
    },
  },
  {
    name: 'list_countries',
    description: 'List countries that have radio stations, with station counts.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'list_tags',
    description: 'List the most common radio station genres and tags by station count.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Maximum number of tags to return. Defaults to 20.',
        },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search_stations':
      return searchStations(
        args.query as string,
        (args.limit as number | undefined) ?? 10,
      );
    case 'get_top_stations':
      return getTopStations(
        (args.count as number | undefined) ?? 10,
        args.country as string | undefined,
      );
    case 'list_countries':
      return listCountries();
    case 'list_tags':
      return listTags((args.limit as number | undefined) ?? 20);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function searchStations(query: string, limit: number) {
  const params = new URLSearchParams({
    limit: String(limit),
    order: 'votes',
    reverse: 'true',
  });

  const res = await fetch(
    `${BASE_URL}/stations/byname/${encodeURIComponent(query)}?${params.toString()}`,
  );
  if (!res.ok) throw new Error(`Radio Browser error: ${res.status}`);

  const data = (await res.json()) as RawStation[];

  return {
    count: data.length,
    stations: data.map(formatStation),
  };
}

async function getTopStations(count: number, country: string | undefined) {
  let url: string;

  if (country) {
    const params = new URLSearchParams({
      limit: String(count),
      order: 'votes',
      reverse: 'true',
    });
    url = `${BASE_URL}/stations/bycountry/${encodeURIComponent(country)}?${params.toString()}`;
  } else {
    url = `${BASE_URL}/stations/topvote/${count}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Radio Browser error: ${res.status}`);

  const data = (await res.json()) as RawStation[];

  return {
    count: data.length,
    stations: data.map(formatStation),
  };
}

async function listCountries() {
  const res = await fetch(`${BASE_URL}/countries`);
  if (!res.ok) throw new Error(`Radio Browser error: ${res.status}`);

  const data = (await res.json()) as RawCountry[];

  const sorted = [...data].sort((a, b) => b.stationcount - a.stationcount);

  return {
    count: sorted.length,
    countries: sorted.map((c) => ({
      name: c.name,
      stationcount: c.stationcount,
    })),
  };
}

async function listTags(limit: number) {
  const params = new URLSearchParams({
    order: 'stationcount',
    reverse: 'true',
    limit: String(limit),
  });

  const res = await fetch(`${BASE_URL}/tags?${params.toString()}`);
  if (!res.ok) throw new Error(`Radio Browser error: ${res.status}`);

  const data = (await res.json()) as RawTag[];

  return {
    count: data.length,
    tags: data.map((t) => ({
      name: t.name,
      stationcount: t.stationcount,
    })),
  };
}

export default { tools, callTool } satisfies McpToolExport;

/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Meta {
  fums: string;
  fumsId: string;
  fumsJsInclude: string;
  fumsJs: string;
  fumsNoScript: string;
}

export interface BibleSummary {
  id: string;
  dblId: string;
  abbreviation: string;
  abbreviationLocal: string;
  language: Language;
  countries: {
    id: string;
    name: string;
    nameLocal: string;
  }[];
  name: string;
  nameLocal: string;
  description: string;
  descriptionLocal: string;
  relatedDbl: string;
  type: string;
  /** @format date-time */
  updatedAt: string;
  audioBibles?: AudioBibleSummary[];
}

export interface AudioBibleSummary {
  id: string;
  name: string;
  nameLocal: string;
  description: string;
  descriptionLocal: string;
}

export interface Bible {
  id: string;
  dblId: string;
  abbreviation: string;
  abbreviationLocal: string;
  copyright: string;
  language: {
    id?: string;
    name?: string;
    nameLocal?: string;
    script?: string;
    scriptDirection?: string;
  };
  countries: {
    id: string;
    name: string;
    nameLocal: string;
  }[];
  name: string;
  nameLocal: string;
  description: string;
  descriptionLocal: string;
  info: string;
  type: string;
  /** @format date-time */
  updatedAt: string;
  relatedDbl: string;
  audioBibles: AudioBibleSummary[];
}

export interface Book {
  id: string;
  bibleId: string;
  abbreviation: string;
  name: string;
  nameLong: string;
  chapters?: ChapterSummary[];
}

export interface ChapterSummary {
  id: string;
  bibleId: string;
  number: string;
  bookId: string;
  reference: string;
}

export interface Chapter {
  id: string;
  bibleId: string;
  number: string;
  bookId: string;
  content: string;
  reference: string;
  verseCount: number;
  next?: {
    id?: string;
    bookId?: string;
    number?: string;
  };
  previous?: {
    id?: string;
    bookId?: string;
    number?: string;
  };
  copyright: string;
}

export interface Language {
  id: string;
  name: string;
  nameLocal: string;
  script: string;
  scriptDirection: string;
}

export interface Passage {
  id: string;
  bibleId: string;
  orgId: string;
  content: string;
  reference: string;
  verseCount: number;
  copyright: string;
}

export interface Verse {
  id: string;
  orgId: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  content: string;
  reference: string;
  verseCount: number;
  copyright: string;
  next?: {
    id?: string;
    bookId?: string;
  };
  previous?: {
    id?: string;
    bookId?: string;
  };
}

export interface SectionSummary {
  id: string;
  bibleId: string;
  bookId: string;
  title: string;
  firstVerseId: string;
  lastVerseId: string;
  firstVerseOrgId: string;
  lastVerseOrgId: string;
}

export interface Section {
  id: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  title: string;
  content: string;
  verseCount: number;
  firstVerseId: string;
  lastVerseId: string;
  firstVerseOrgId: string;
  lastVerseOrgId: string;
  copyright: string;
  next?: {
    id?: string;
    title?: string;
  };
  previous?: {
    id?: string;
    title?: string;
  };
}

export interface VerseSummary {
  id: string;
  orgId: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  reference: string;
}

export interface SearchVerse {
  id: string;
  orgId: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  text: string;
  reference?: string;
}

export interface SearchResponse {
  query: string;
  limit: number;
  offset: number;
  total: number;
  verseCount: number;
  verses: SearchVerse[];
  passages?: Passage[];
}

export interface AudioBible {
  id: string;
  dblId: string;
  abbreviation: string;
  abbreviationLocal: string;
  copyright: string;
  language: Language;
  countries: {
    id: string;
    name: string;
    nameLocal: string;
  }[];
  name: string;
  nameLocal: string;
  description: string;
  descriptionLocal: string;
  info: string;
  type: string;
  /** @format date-time */
  updatedAt: string;
  relatedDbl: string;
}

export interface AudioChapter {
  id: string;
  bibleId: string;
  number: string;
  bookId: string;
  resourceUrl: string;
  timecodes?: {
    end: string;
    start: string;
    verseId: string;
  }[];
  expiresAt: number;
  reference: string;
  next?: {
    id?: string;
    bookId?: string;
    number?: string;
  };
  previous?: {
    id?: string;
    bookId?: string;
    number?: string;
  };
  copyright?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "https://api.scripture.api.bible";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title API.Bible
 * @version 1.6.3
 * @termsOfService http://api.bible/terms/
 * @baseUrl https://api.scripture.api.bible
 * @contact support@api.bible
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  v1 = {
    /**
     * @description Gets an array of `Bible` objects authorized for current API Key
     *
     * @tags Bibles
     * @name GetBibles
     * @request GET:/v1/bibles
     * @secure
     */
    getBibles: (
      query?: {
        /** ISO 639-3 three digit language code used to filter results */
        language?: string;
        /** Bible abbreviation to search for */
        abbreviation?: string;
        /** Bible name to search for */
        name?: string;
        /** Comma separated list of Bible Ids to return */
        ids?: string;
        /** Boolean to include full Bible details (e.g. copyright and promo info) */
        "include-full-details"?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: BibleSummary[];
        },
        void
      >({
        path: `/v1/bibles`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Gets a single `Bible` for a given `bibleId`
     *
     * @tags Bibles
     * @name GetBible
     * @request GET:/v1/bibles/{bibleId}
     * @secure
     */
    getBible: (bibleId: string, params: RequestParams = {}) =>
      this.request<
        {
          data: Bible;
        },
        void
      >({
        path: `/v1/bibles/${bibleId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Gets an array of `Book` objects for a given `bibleId`
     *
     * @tags Books
     * @name GetBooks
     * @request GET:/v1/bibles/{bibleId}/books
     * @secure
     */
    getBooks: (
      bibleId: string,
      query?: {
        /**
         * Boolean indicating if an array of chapter summaries should be
         * included in the results. Defaults to false.
         */
        "include-chapters"?: boolean;
        /**
         * Boolean indicating if an array of chapter summaries and an array
         * of sections should be included in the results. Defaults to false.
         */
        "include-chapters-and-sections"?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: Book[];
        },
        void
      >({
        path: `/v1/bibles/${bibleId}/books`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Gets a single `Book` object for a given `bibleId` and `bookId`
     *
     * @tags Books
     * @name GetBook
     * @request GET:/v1/bibles/{bibleId}/books/{bookId}
     * @secure
     */
    getBook: (
      bibleId: string,
      bookId: string,
      query?: {
        /**
         * Boolean indicating if an array of chapter summaries should be
         * included in the results. Defaults to false.
         */
        "include-chapters"?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: Book;
        },
        void
      >({
        path: `/v1/bibles/${bibleId}/books/${bookId}`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Gets an array of `Chapter` objects for a given `bibleId` and `bookId`
     *
     * @tags Chapters
     * @name GetChapters
     * @request GET:/v1/bibles/{bibleId}/books/{bookId}/chapters
     * @secure
     */
    getChapters: (bibleId: string, bookId: string, params: RequestParams = {}) =>
      this.request<
        {
          data: ChapterSummary[];
        },
        void
      >({
        path: `/v1/bibles/${bibleId}/books/${bookId}/chapters`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Gets a single `Chapter` object for a given `bibleId` and `chapterId`. This Chapter object also includes an `content` property with all verses for the Chapter.
     *
     * @tags Chapters
     * @name GetChapter
     * @request GET:/v1/bibles/{bibleId}/chapters/{chapterId}
     * @secure
     */
    getChapter: (
      bibleId: string,
      chapterId: string,
      query?: {
        /**
         * Content type to be returned in the content property.  Supported values are `html` (default), `json` (beta), and `text` (beta)
         * @default "html"
         */
        "content-type"?: "html" | "json" | "text";
        /**
         * Include footnotes in content
         * @default false
         */
        "include-notes"?: boolean;
        /**
         * Include section titles in content
         * @default true
         */
        "include-titles"?: boolean;
        /**
         * Include chapter numbers in content
         * @default false
         */
        "include-chapter-numbers"?: boolean;
        /**
         * Include verse numbers in content.
         * @default true
         */
        "include-verse-numbers"?: boolean;
        /**
         * Include spans that wrap verse numbers and verse text for bible content.
         * @default false
         */
        "include-verse-spans"?: boolean;
        /** Comma delimited list of bibleIds to include */
        parallels?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: Chapter;
          meta: Meta;
        },
        void
      >({
        path: `/v1/bibles/${bibleId}/chapters/${chapterId}`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Gets a `Passage` object for a given `bibleId` and `passageId`. This Passage object also includes an `content` property with all verses corresponding to the passageId. The `passageId` parameter can represent a chapter, verse, or range of verses.
     *
     * @tags Passages
     * @name GetPassage
     * @request GET:/v1/bibles/{bibleId}/passages/{passageId}
     * @secure
     */
    getPassage: (
      bibleId: string,
      passageId: string,
      query?: {
        /**
         * Content type to be returned in the content property.  Supported values are `html` (default), `json` (beta), and `text` (beta)
         * @default "html"
         */
        "content-type"?: "html" | "json" | "text";
        /**
         * Include footnotes in content
         * @default false
         */
        "include-notes"?: boolean;
        /**
         * Include section titles in content
         * @default true
         */
        "include-titles"?: boolean;
        /**
         * Include chapter numbers in content
         * @default false
         */
        "include-chapter-numbers"?: boolean;
        /**
         * Include verse numbers in content.
         * @default true
         */
        "include-verse-numbers"?: boolean;
        /**
         * Include spans that wrap verse numbers and verse text for bible content.
         * @default false
         */
        "include-verse-spans"?: boolean;
        /** Comma delimited list of bibleIds to include */
        parallels?: string;
        /**
         * Use the supplied id(s) to match the verseOrgId instead of the verseId
         * @default false
         */
        "use-org-id"?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: Passage;
          meta: Meta;
        },
        void
      >({
        path: `/v1/bibles/${bibleId}/passages/${passageId}`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Gets an array of `Section` objects for a given `bibleId` and `bookId`
     *
     * @tags Sections
     * @name GetBookSections
     * @request GET:/v1/bibles/{bibleId}/books/{bookId}/sections
     * @secure
     */
    getBookSections: (bibleId: string, bookId: string, params: RequestParams = {}) =>
      this.request<
        {
          data: SectionSummary[];
        },
        void
      >({
        path: `/v1/bibles/${bibleId}/books/${bookId}/sections`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Gets an array of `Section` objects for a given `bibleId` and `chapterId`
     *
     * @tags Sections
     * @name GetChapterSections
     * @request GET:/v1/bibles/{bibleId}/chapters/{chapterId}/sections
     * @secure
     */
    getChapterSections: (bibleId: string, chapterId: string, params: RequestParams = {}) =>
      this.request<
        {
          data: SectionSummary[];
        },
        void
      >({
        path: `/v1/bibles/${bibleId}/chapters/${chapterId}/sections`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Gets a single `Section` object for a given `bibleId` and `sectionId`. This Section object also includes an `content` property with all verses for the Section.
     *
     * @tags Sections
     * @name GetSection
     * @request GET:/v1/bibles/{bibleId}/sections/{sectionId}
     * @secure
     */
    getSection: (
      bibleId: string,
      sectionId: string,
      query?: {
        /**
         * Content type to be returned in the content property.  Supported values are `html` (default), `json` (beta), and `text` (beta)
         * @default "html"
         */
        "content-type"?: "html" | "json" | "text";
        /**
         * Include footnotes in content
         * @default false
         */
        "include-notes"?: boolean;
        /**
         * Include section titles in content
         * @default true
         */
        "include-titles"?: boolean;
        /**
         * Include chapter numbers in content
         * @default false
         */
        "include-chapter-numbers"?: boolean;
        /**
         * Include verse numbers in content.
         * @default true
         */
        "include-verse-numbers"?: boolean;
        /**
         * Include spans that wrap verse numbers and verse text for bible content.
         * @default false
         */
        "include-verse-spans"?: boolean;
        /** Comma delimited list of bibleIds to include */
        parallels?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: Section;
          meta: Meta;
        },
        void
      >({
        path: `/v1/bibles/${bibleId}/sections/${sectionId}`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Gets an array of `Verse` objects for a given `bibleId` and `chapterId`
     *
     * @tags Verses
     * @name GetVerses
     * @request GET:/v1/bibles/{bibleId}/chapters/{chapterId}/verses
     * @secure
     */
    getVerses: (bibleId: string, chapterId: string, params: RequestParams = {}) =>
      this.request<
        {
          data: VerseSummary[];
        },
        void
      >({
        path: `/v1/bibles/${bibleId}/chapters/${chapterId}/verses`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Gets a `Verse` object for a given `bibleId` and `verseId`. This Verse object also includes an `content` property with the verse corresponding to the verseId.
     *
     * @tags Verses
     * @name GetVerse
     * @request GET:/v1/bibles/{bibleId}/verses/{verseId}
     * @secure
     */
    getVerse: (
      bibleId: string,
      verseId: string,
      query?: {
        /**
         * Content type to be returned in the content property.  Supported values are `html` (default), `json` (beta), and `text` (beta)
         * @default "html"
         */
        "content-type"?: "html" | "json" | "text";
        /**
         * Include footnotes in content
         * @default false
         */
        "include-notes"?: boolean;
        /**
         * Include section titles in content
         * @default true
         */
        "include-titles"?: boolean;
        /**
         * Include chapter numbers in content
         * @default false
         */
        "include-chapter-numbers"?: boolean;
        /**
         * Include verse numbers in content.
         * @default true
         */
        "include-verse-numbers"?: boolean;
        /**
         * Include spans that wrap verse numbers and verse text for bible content.
         * @default false
         */
        "include-verse-spans"?: boolean;
        /** Comma delimited list of bibleIds to include */
        parallels?: string;
        /**
         * Use the supplied id(s) to match the verseOrgId instead of the verseId
         * @default false
         */
        "use-org-id"?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: Verse;
          meta: Meta;
        },
        void
      >({
        path: `/v1/bibles/${bibleId}/verses/${verseId}`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Gets search results for a given `bibleId` and query string.  Searches will match all verses with the list of keywords provided in the query string. Order of the keywords does not matter. However all keywords must be present in a verse for it to be considered a match. The total number of results returned from a search can be limited by populating the `limit` attribute in the query string with a non-negative integer value.  If no limit value is provide a default of 10 is used. `offset` can be used to traverse paginated results.  So for example if you are using the default `limit` of 10, using an `offset` of 10 will return the second page of results, namely results 11-20. The `text` property of each verse object contains only the verse text.  It does not contain footnote references. However, those can be queried directly using the `/bibles/{bibleId}/verses/{verseId}` endpoint.
     *
     * @tags Search
     * @name SearchBible
     * @request GET:/v1/bibles/{bibleId}/search
     * @secure
     */
    searchBible: (
      bibleId: string,
      query?: {
        /**
         * Search keywords or passage reference.  Supported wildcards are * and ?.
         * The * wildcard matches any character sequence (e.g. searching for "wo*d" finds text such as "word", "world", and "worshipped").
         * The ? wildcard matches any matches any single character (e.g. searching for "l?ve" finds text such as "live" and "love").
         */
        query?: string;
        /** Integer limit for how many matching results to return. Default is 10. */
        limit?: number;
        /** Offset for search results. Used to paginate results */
        offset?: number;
        /**
         * Sort order of results.  Supported values are `relevance` (default), `canonical` and `reverse-canonical`
         * @default "relevance"
         */
        sort?: "relevance" | "canonical" | "reverse-canonical";
        /** One or more, comma seperated, passage ids (book, chapter, verse) which the search will be limited to.  (i.e. gen.1,gen.5 or gen-num or gen.1.1-gen.3.5) */
        range?: string;
        /** Sets the fuzziness of a search to account for misspellings. Values can be 0, 1, 2, or AUTO. Defaults to AUTO which varies depending on the */
        fuzziness?: "AUTO" | "0" | "1" | "2";
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          query?: string;
          data: SearchResponse;
          meta: Meta;
        },
        void
      >({
        path: `/v1/bibles/${bibleId}/search`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Gets an array of audio `Bible` objects authorized for current API Key
     *
     * @tags Bibles
     * @name GetAudioBibles
     * @request GET:/v1/audio-bibles
     * @secure
     */
    getAudioBibles: (
      query?: {
        /** ISO 639-3 three digit language code used to filter results */
        language?: string;
        /** Bible abbreviation to search for */
        abbreviation?: string;
        /** Bible name to search for */
        name?: string;
        /** Comma separated list of Bible Ids to return */
        ids?: string;
        /** bibleId of related text Bible used to filter audio bible results */
        bibleId?: string;
        /** Boolean to include full Bible details (e.g. copyright and promo info) */
        "include-full-details"?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: BibleSummary[];
        },
        void
      >({
        path: `/v1/audio-bibles`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Gets a single audio `Bible` for a given `audioBibleId`
     *
     * @tags Bibles
     * @name GetAudioBible
     * @request GET:/v1/audio-bibles/{audioBibleId}
     * @secure
     */
    getAudioBible: (audioBibleId: string, params: RequestParams = {}) =>
      this.request<
        {
          data: AudioBible;
        },
        void
      >({
        path: `/v1/audio-bibles/${audioBibleId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Gets an array of `Book` objects for a given `audioBibleId`
     *
     * @tags Books
     * @name GetAudioBooks
     * @request GET:/v1/audio-bibles/{audioBibleId}/books
     * @secure
     */
    getAudioBooks: (
      audioBibleId: string,
      query?: {
        /**
         * Boolean indicating if an array of chapter summaries should be
         * included in the results. Defaults to false.
         */
        "include-chapters"?: boolean;
        /**
         * Boolean indicating if an array of chapter summaries and an array
         * of sections should be included in the results. Defaults to false.
         */
        "include-chapters-and-sections"?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: Book[];
        },
        void
      >({
        path: `/v1/audio-bibles/${audioBibleId}/books`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Gets a single `Book` object for a given `audioBibleId` and `bookId`
     *
     * @tags Books
     * @name GetAudioBook
     * @request GET:/v1/audio-bibles/{audioBibleId}/books/{bookId}
     * @secure
     */
    getAudioBook: (
      audioBibleId: string,
      bookId: string,
      query?: {
        /**
         * Boolean indicating if an array of chapter summaries should be
         * included in the results. Defaults to false.
         */
        "include-chapters"?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data: Book;
        },
        void
      >({
        path: `/v1/audio-bibles/${audioBibleId}/books/${bookId}`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Gets an array of `Chapter` objects for a given `audioBibleId` and `bookId`
     *
     * @tags Chapters
     * @name GetAudioChapters
     * @request GET:/v1/audio-bibles/{audioBibleId}/books/{bookId}/chapters
     * @secure
     */
    getAudioChapters: (audioBibleId: string, bookId: string, params: RequestParams = {}) =>
      this.request<
        {
          data: ChapterSummary[];
        },
        void
      >({
        path: `/v1/audio-bibles/${audioBibleId}/books/${bookId}/chapters`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Gets a single `Chapter` object for a given `audioBibleId` and `chapterId`. This AudioChapter object also includes an `resourceUrl` property with a HTTP URL to the mp3 audio resource for the chapter.  The `resourceUrl` is unique per request and expires in XX minutes.  The `expiresAt` property provides the Unix time value of `resourceUrl` expiration.
     *
     * @tags Chapters
     * @name GetAudioChapter
     * @request GET:/v1/audio-bibles/{audioBibleId}/chapters/{chapterId}
     * @secure
     */
    getAudioChapter: (audioBibleId: string, chapterId: string, params: RequestParams = {}) =>
      this.request<
        {
          data: AudioChapter;
          meta: Meta;
        },
        void
      >({
        path: `/v1/audio-bibles/${audioBibleId}/chapters/${chapterId}`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
}

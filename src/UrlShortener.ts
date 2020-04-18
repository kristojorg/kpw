import { URL } from "universal-url";

export default class UrlShortener {
  private readonly catalogUrl: string;
  private readonly enabled: boolean;

  constructor(catalogUrl: string, enabled = true) {
    this.catalogUrl = catalogUrl;
    this.enabled = enabled;
  }

  private catalogBase(): string {
    // The origin and library short name in a catalog URL are safe to remove.
    const url = new URL(this.catalogUrl);
    const origin = url.origin;
    const pathname = url.pathname;
    const libraryShortName =
      pathname.split("/").length > 1 && pathname.split("/")[1];
    return origin + "/" + libraryShortName;
  }

  prepareCollectionUrl(url: string): string {
    if (this.enabled) {
      url = url
        .replace(this.catalogBase(), "")
        .replace(/\/$/, "")
        .replace(/^\//, "");
    }
    return encodeURIComponent(url);
  }

  prepareBookUrl(url: string): string {
    if (this.enabled) {
      url = url.replace(this.catalogBase() + "/works/", "").replace(/^\//, "");
    }
    return encodeURIComponent(url);
  }

  expandCollectionUrl(collectionUrl): string {
    if (this.enabled) {
      return collectionUrl
        ? this.catalogBase() + "/" + collectionUrl
        : this.catalogBase();
    } else {
      return collectionUrl;
    }
  }

  expandBookUrl(bookUrl): string {
    return bookUrl && this.enabled
      ? this.catalogBase() + "/works/" + bookUrl
      : bookUrl;
  }
}

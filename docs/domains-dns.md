# Domains & DNS

## Domain map

| Hostname | Points to | Purpose |
|---|---|---|
| `angelfashionstudio.org` (apex) | 307 → `www` | Redirects to the www storefront |
| `www.angelfashionstudio.org` | Vercel | **Customer storefront** |
| `admin.angelfashionstudio.org` | Vercel (same project) | **Admin panel** (hostname triggers admin routes) |
| `prod-api.angelfashionstudio.org` | `209.38.89.133` (DigitalOcean droplet) | **Backend API** |
| `mail` (CNAME) | `business.zoho.com` | Zoho Mail |

- **Registrar / DNS host:** OpenSRS — managed at **https://manage.opensrs.net**
- **Nameservers:** `ns1.systemdns.com`, `ns2.systemdns.com`, `ns3.systemdns.com`
- **Mail:** Zoho, **India datacenter** (MX → `mx.zoho.in`). This matters for email — see [email.md](email.md).

> The customer-facing URL used in code (redirects, email links) is **`https://www.angelfashionstudio.org`** — always the `www` form, because the apex 307-redirects to it.

## Live DNS zone (OpenSRS)

### A records
| Host | Value |
|---|---|
| `@` (apex) | `216.198.79.1` |
| `prod-api` | `209.38.89.133` (the backend droplet) |

### CNAME records
| Host | Value |
|---|---|
| `www` | `39730e61a784a777.vercel-dns-017.com` (Vercel) |
| `admin` | `39730e61a784a777.vercel-dns-017.com` (Vercel) |
| `mail` | `business.zoho.com` |
| `bounce-zem` | `cluster89.zeptomail.in` (ZeptoMail return-path) |

### MX records (Zoho India)
| Priority | Host |
|---|---|
| 10 | `mx.zoho.in` |
| 20 | `mx2.zoho.in` |
| 50 | `mx3.zoho.in` |

### TXT records
| Host | Value | Purpose |
|---|---|---|
| `@` | `v=spf1 include:zoho.in ~all` | SPF (Zoho) |
| `zoho._domainkey` | `v=DKIM1; k=rsa; p=…` | Zoho Mail DKIM |
| `26104357._domainkey` | `k=rsa; p=…` | **ZeptoMail DKIM** |

## How to add a DNS record at OpenSRS

1. Log in to **manage.opensrs.net** → open **angelfashionstudio.org** → **Name Servers/DNS → Modify DNS Zone**.
2. In the relevant section (A / CNAME / TXT…), click **Add Record**. Enter the **Subdomain** as just the host part (e.g. `bounce-zem`) — OpenSRS appends `.angelfashionstudio.org` automatically.
3. **Save / apply the zone.** Adding a row to the table is *not* live until you save.
4. Verify with: `nslookup -type=TXT <host>.angelfashionstudio.org 8.8.8.8` (or query the authoritative server `ns1.systemdns.com`).

> Multiple DKIM selectors coexist fine — `zoho._domainkey` (Zoho Mail) and `26104357._domainkey` (ZeptoMail) are independent. Don't remove either.

## Gotchas learned the hard way
- **DNS is at OpenSRS, not Zoho.** Even though mail is on Zoho, the zone is edited in OpenSRS.
- After adding records in OpenSRS you **must click Save** — the authoritative `systemdns.com` nameservers won't serve them until the zone is republished (a few minutes).
- Use the **`www`** storefront URL everywhere customer-facing; the apex just redirects.

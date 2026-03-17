---
title: "What Is DNS? How the Domain Name System Works (Simple Explanation)"
description: "Understand how DNS works in plain English. Learn about DNS queries, record types, public DNS servers, caching, security threats like DNS hijacking and DNS leaks, and how to change your DNS settings."
keywords: ["what is dns", "how dns works", "domain name system explained"]
pubDate: "2026-03-17"
updatedDate: "2026-03-17"
author: "vpn-expert"
faq:
  - question: "What happens if DNS stops working?"
    answer: "If DNS stops working, your browser cannot translate domain names into IP addresses, meaning you won't be able to access websites by their names (like google.com). However, your internet connection itself is still active — you could technically access websites by typing their IP addresses directly, though this is impractical for everyday use."
  - question: "What is the best public DNS server to use?"
    answer: "Cloudflare DNS (1.1.1.1) is generally considered the fastest public DNS server, while Google DNS (8.8.8.8) offers the most reliable global infrastructure. For added security with built-in malware blocking, Quad9 (9.9.9.9) is an excellent choice. The best option depends on your priorities — speed, privacy, or security."
  - question: "Can someone hack my DNS?"
    answer: "Yes, DNS hijacking and DNS spoofing are real threats. Attackers can redirect your DNS queries to malicious servers, sending you to fake websites designed to steal your credentials. Using DNS over HTTPS (DoH), DNSSEC-enabled resolvers, and a VPN with DNS leak protection are the best defenses against DNS-based attacks."
  - question: "Does changing DNS improve internet speed?"
    answer: "Changing to a faster DNS server can improve the speed at which websites initially load (the DNS lookup phase), but it won't increase your overall download/upload speeds. If your ISP's DNS is slow, switching to Cloudflare (1.1.1.1) or Google (8.8.8.8) DNS can noticeably reduce page load times, especially for the first visit to a website."
---

## DNS: The Internet's Phone Book

Every time you type a website address into your browser — like `www.google.com` — something remarkable happens behind the scenes in milliseconds. Your computer doesn't actually understand domain names. It needs a numerical IP address (like `142.250.80.46`) to find and connect to the correct server. The system that translates human-friendly domain names into machine-readable IP addresses is called the **Domain Name System**, or DNS.

Think of DNS as the internet's phone book. Just as you look up a person's name in a phone book to find their phone number, DNS looks up a domain name to find its corresponding IP address. Without DNS, you'd have to memorize long strings of numbers for every website you want to visit — an impractical task considering there are over 1.1 billion websites on the internet.

DNS was created in 1983 by Paul Mockapetris to replace the previous system, which relied on a single manually maintained file (called HOSTS.TXT) that mapped hostnames to IP addresses. As the internet grew, this centralized approach became unmanageable, and DNS was born as a distributed, hierarchical system that could scale with the internet's explosive growth.

## How DNS Works: The Query Process Step by Step

When you type a URL into your browser, a DNS query is triggered. This process involves multiple servers working together, and it typically completes in under 100 milliseconds. Here's exactly what happens:

### Step 1: Check the Local Cache

Before reaching out to any external server, your browser checks its own DNS cache to see if it already knows the IP address for the domain you requested. If not, it checks your operating system's DNS cache. If the address is found in either cache, the lookup is done — no external queries needed.

### Step 2: Query the Recursive Resolver

If the address isn't cached locally, your device sends a query to a **recursive resolver** (also called a recursive DNS server). This is typically operated by your ISP or a public DNS provider like Google or Cloudflare. The recursive resolver acts as a middleman — it does the heavy lifting of finding the answer for you.

### Step 3: Contact the Root Name Servers

If the recursive resolver doesn't have the answer cached, it starts from the top of the DNS hierarchy by contacting a **root name server**. There are 13 sets of root name servers worldwide (labeled A through M), operated by organizations like ICANN, Verisign, and NASA. These servers don't know the specific IP addresses of websites, but they know where to direct the query next based on the top-level domain (.com, .org, .net, etc.).

### Step 4: Query the TLD Name Server

The root server directs the resolver to the appropriate **Top-Level Domain (TLD) name server**. For example, if you're looking up `www.example.com`, the resolver is directed to the `.com` TLD name server. The TLD server knows which authoritative name server is responsible for the specific domain.

### Step 5: Query the Authoritative Name Server

The TLD server points the resolver to the **authoritative name server** for the domain — this is the server that has the definitive DNS records for `example.com`. The authoritative server responds with the IP address associated with the requested domain.

### Step 6: Return the Result

The recursive resolver receives the IP address, caches it for future requests (according to the record's TTL — Time to Live), and sends it back to your device. Your browser then uses this IP address to connect to the web server and load the website.

### Recursive vs. Iterative Queries

There are two types of DNS queries:

- **Recursive query:** Your device asks the recursive resolver for a definitive answer. The resolver must either return the IP address or an error — it can't redirect you to another server. This is what happens between your device and the resolver.
- **Iterative query:** The recursive resolver asks other DNS servers (root, TLD, authoritative) one at a time. Each server responds with the best information it has, which may be a referral to the next server in the chain. The resolver follows these referrals until it gets the final answer.

## DNS Record Types Explained

DNS doesn't just map domain names to IP addresses. It supports multiple record types, each serving a different purpose:

### A Record (Address Record)

The most fundamental DNS record. An **A record** maps a domain name to an **IPv4 address** (32-bit, like `93.184.216.34`). When you type a website URL, the A record is what ultimately connects you to the right server.

```
example.com.    A    93.184.216.34
```

### AAAA Record (IPv6 Address Record)

The IPv6 equivalent of an A record. An **AAAA record** maps a domain name to an **IPv6 address** (128-bit, like `2606:2800:220:1:248:1893:25c8:1946`). As the internet transitions from IPv4 to IPv6, AAAA records are becoming increasingly important.

```
example.com.    AAAA    2606:2800:220:1:248:1893:25c8:1946
```

### CNAME Record (Canonical Name Record)

A **CNAME record** creates an alias that points one domain name to another domain name (not an IP address). This is commonly used to point subdomains to the main domain.

```
www.example.com.    CNAME    example.com.
blog.example.com.   CNAME    example.com.
```

### MX Record (Mail Exchange Record)

**MX records** specify which mail servers are responsible for receiving email for a domain. They include a priority value — lower numbers indicate higher priority.

```
example.com.    MX    10    mail1.example.com.
example.com.    MX    20    mail2.example.com.
```

### TXT Record (Text Record)

**TXT records** hold arbitrary text data associated with a domain. They're widely used for email authentication (SPF, DKIM, DMARC), domain ownership verification, and security policies.

```
example.com.    TXT    "v=spf1 include:_spf.google.com ~all"
```

### Other Common Record Types

- **NS Record** — Identifies the authoritative name servers for a domain
- **PTR Record** — Reverse DNS lookup (IP address to domain name)
- **SOA Record** — Contains administrative information about a DNS zone
- **SRV Record** — Specifies the location of services (used for VoIP, messaging, etc.)
- **CAA Record** — Specifies which certificate authorities can issue SSL certificates for a domain

## Public DNS Servers: A Detailed Comparison

Most people use the default DNS servers provided by their ISP without even knowing it. However, public DNS servers often offer better speed, reliability, and security. Here's a comprehensive comparison of the top options:

### Google Public DNS (8.8.8.8 / 8.8.4.4)

Google's DNS is the most widely used public DNS service in the world. It leverages Google's massive global infrastructure to deliver fast, reliable resolution.

- **Speed:** Excellent global performance
- **Privacy:** Google logs query data temporarily for diagnostic purposes
- **Security:** Supports DNSSEC validation
- **Best for:** General users who want reliable, fast DNS

### Cloudflare DNS (1.1.1.1 / 1.0.0.1)

Cloudflare's DNS service, launched in 2018, is designed with a privacy-first approach and consistently ranks as one of the fastest DNS resolvers.

- **Speed:** Fastest average response times according to independent benchmarks
- **Privacy:** Commits to never selling user data; purges all logs within 24 hours; audited by KPMG
- **Security:** Supports DNS over HTTPS (DoH) and DNS over TLS (DoT)
- **Best for:** Privacy-conscious users who also want top speed

### Quad9 (9.9.9.9 / 149.112.112.112)

Quad9 is a nonprofit DNS service that automatically blocks access to known malicious domains using threat intelligence from multiple security partners.

- **Speed:** Good performance, though slightly slower than Cloudflare
- **Privacy:** Does not log user IP addresses
- **Security:** Built-in malware and phishing domain blocking; supports DNSSEC
- **Best for:** Users who want built-in security protection at the DNS level

### OpenDNS (208.67.222.222 / 208.67.220.220)

Now owned by Cisco, OpenDNS offers both free and premium DNS services with customizable content filtering options.

- **Speed:** Solid performance globally
- **Privacy:** Logs data for the filtering service to function
- **Security:** Customizable content filtering; optional parental controls
- **Best for:** Families and organizations that want content filtering capabilities

## DNS Caching: Speeding Up the Internet

DNS caching is a critical optimization that stores DNS query results at multiple levels, reducing the need for repeated full DNS lookups:

### Browser Cache

Your web browser maintains its own DNS cache. Chrome, Firefox, Safari, and Edge all store recent DNS lookups to speed up revisits to the same websites. Browser DNS caches typically hold entries for 1-10 minutes.

### Operating System Cache

Your operating system maintains a system-wide DNS cache that serves all applications. On Windows, the DNS Client service manages this cache. On macOS and Linux, system resolvers handle caching.

You can view the contents of your DNS cache:

**Windows:** `ipconfig /displaydns`

**macOS:** `sudo killall -INFO mDNSResponder` (results appear in Console.app)

### Resolver Cache

The recursive resolver (your ISP's DNS or public DNS like 8.8.8.8) caches query results based on the **TTL (Time to Live)** value set by the domain's authoritative server. TTL values typically range from 300 seconds (5 minutes) to 86,400 seconds (24 hours).

### How TTL Works

When a DNS record is created, the domain administrator sets a TTL value that tells resolvers how long to cache the record. A shorter TTL means DNS changes propagate faster, while a longer TTL reduces DNS query load but delays the propagation of changes.

For example, if `example.com` has an A record with a TTL of 3600 (1 hour), any resolver that looks up this record will cache the result for up to 1 hour before querying the authoritative server again.

## DNS Security: Threats and Protections

DNS was designed in the 1980s when security wasn't a primary concern. As a result, the original DNS protocol has several vulnerabilities that attackers can exploit:

### DNS Hijacking

**DNS hijacking** occurs when an attacker redirects DNS queries to a malicious DNS server. This can happen through malware on your device, compromised router settings, or even at the ISP level. Once hijacked, you could be directed to fake versions of legitimate websites designed to steal your login credentials.

**Protection:** Use trusted DNS servers, keep your router firmware updated, regularly scan for malware, and enable DNSSEC where possible.

### DNS Spoofing (Cache Poisoning)

**DNS cache poisoning** involves injecting false DNS records into a resolver's cache. When a user queries the poisoned resolver, they receive a fraudulent IP address and are sent to a malicious website.

**Protection:** Use DNS resolvers that support DNSSEC validation, which cryptographically verifies that DNS responses are authentic and haven't been tampered with.

### DNS Leaks

A **DNS leak** occurs when your DNS queries are sent outside of a secure connection (like a VPN tunnel) and are visible to your ISP or other third parties. Even if you're using a VPN to encrypt your traffic, a DNS leak can expose which websites you're visiting.

DNS leaks are a significant privacy concern, and a quality VPN should include [DNS leak protection](/vpn-usa/posts/best-vpn-usa-dns-leak-protection/) to ensure all DNS queries stay within the encrypted tunnel. For detailed guidance on choosing a VPN that prevents DNS leaks, see our [DNS leak protection VPN guide](/vpn-usa/posts/usa-vpn-for-dns-leak-protection/).

### DNS over HTTPS (DoH) and DNS over TLS (DoT)

Traditional DNS queries are sent in plain text, meaning anyone who can see your network traffic (ISP, Wi-Fi operator, attacker) can see which domains you're looking up. **DNS over HTTPS (DoH)** and **DNS over TLS (DoT)** encrypt DNS queries to prevent this eavesdropping.

- **DoH** encrypts DNS queries within HTTPS traffic on port 443, making DNS requests indistinguishable from regular web browsing
- **DoT** encrypts DNS queries using TLS on a dedicated port (853), making it easier to manage but also easier to block

Most major browsers now support DoH, and public DNS providers like Cloudflare and Google support both DoH and DoT.

## How to Change Your DNS Settings

Switching to a different DNS server is straightforward and can be done at the device level or router level.

### Change DNS on Windows

1. Open **Settings** > **Network & Internet** > **Advanced network settings**
2. Click **More network adapter options**
3. Right-click your active connection and select **Properties**
4. Select **Internet Protocol Version 4 (TCP/IPv4)** and click **Properties**
5. Select **"Use the following DNS server addresses"**
6. Enter your preferred DNS addresses (e.g., `1.1.1.1` and `1.0.0.1`)
7. Click **OK** and close all dialogs

### Change DNS on macOS

1. Open **System Settings** > **Network**
2. Select your active connection (Wi-Fi or Ethernet)
3. Click **Details** > **DNS**
4. Remove existing DNS entries and add your preferred DNS servers
5. Click **OK** and then **Apply**

### Change DNS on Your Router

Changing DNS at the router level applies the new DNS settings to every device on your network:

1. Access your router's admin panel (typically `192.168.1.1` or `192.168.0.1`)
2. Log in with your admin credentials
3. Find the **DNS settings** (usually under WAN, Internet, or DHCP settings)
4. Replace the existing DNS addresses with your preferred public DNS
5. Save and restart the router

### Change DNS on Mobile Devices

**iOS:** Settings > Wi-Fi > tap the (i) next to your network > Configure DNS > Manual > add your DNS servers

**Android:** Settings > Network & Internet > Private DNS > Private DNS provider hostname > enter `dns.google` or `one.one.one.one`

## DNS and VPNs: How They Work Together

When you use a VPN, your DNS queries are typically handled by the VPN provider's DNS servers rather than your ISP's. This provides several advantages:

- **Privacy:** Your ISP can't see which domains you're resolving
- **Security:** DNS queries are encrypted within the VPN tunnel
- **Consistency:** You get the same DNS behavior regardless of which network you're on
- **No DNS leaks:** Quality VPNs prevent DNS queries from leaking outside the tunnel

However, not all VPNs handle DNS equally well. Some may still allow DNS queries to bypass the VPN tunnel, exposing your browsing activity to your ISP. This is why choosing a VPN with robust [DNS leak protection](/vpn-usa/posts/best-vpn-usa-dns-leak-protection/) is essential for true privacy.

## Key Takeaways

DNS is one of the most fundamental yet often overlooked components of the internet. Here's what to remember:

- **DNS translates domain names to IP addresses** — it's the system that makes the internet usable for humans
- **DNS queries involve multiple server types** — recursive resolvers, root servers, TLD servers, and authoritative servers work together
- **Multiple record types exist** — A, AAAA, CNAME, MX, and TXT records each serve different purposes
- **DNS caching speeds things up** — Caches at the browser, OS, and resolver levels reduce repeated lookups
- **DNS has security vulnerabilities** — Hijacking, spoofing, and leaks are real threats that require attention
- **Public DNS servers are often better** than your ISP's defaults — consider Cloudflare (1.1.1.1) or Google (8.8.8.8)
- **DNS over HTTPS encrypts your queries** — Enable DoH in your browser for better privacy
- **A VPN with DNS leak protection** provides the most comprehensive DNS privacy and security

Understanding how DNS works empowers you to troubleshoot internet issues, improve your browsing performance, and make informed decisions about your online privacy and security.

*This article is for informational purposes only. For our full VPN recommendations, see our [complete VPN guide](/vpn-usa/posts/best-vpn-usa-2025/).*

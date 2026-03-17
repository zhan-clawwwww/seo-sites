---
title: "How to Fix 'DNS Server Not Responding' Error — 10 Proven Solutions (2026)"
description: "Getting a 'DNS Server Not Responding' error? Follow these 10 step-by-step solutions to fix DNS issues on Windows and Mac. Includes commands, screenshots guidance, and tips for permanent fixes."
keywords: ["dns server not responding", "fix dns error", "dns troubleshooting"]
pubDate: "2026-03-17"
updatedDate: "2026-03-17"
author: "vpn-expert"
faq:
  - question: "What does 'DNS Server Not Responding' actually mean?"
    answer: "This error means your device is unable to contact the DNS server to translate a domain name (like google.com) into an IP address. Without DNS resolution, your browser cannot locate websites on the internet, even though your internet connection may be working fine."
  - question: "Can a VPN fix DNS server not responding errors?"
    answer: "Yes, in many cases a VPN can fix DNS issues because VPNs use their own DNS servers instead of your ISP's. If the problem is caused by your ISP's DNS servers being down or misconfigured, connecting to a VPN bypasses them entirely and resolves the issue."
  - question: "Why does the DNS error only affect some websites?"
    answer: "If only certain websites fail to load, it's likely a DNS cache issue or a problem with the DNS records for those specific domains. Try clearing your DNS cache first. If the problem persists, switch to a public DNS server like Google (8.8.8.8) or Cloudflare (1.1.1.1) to get updated DNS records."
  - question: "How often should I flush my DNS cache?"
    answer: "You don't need to flush your DNS cache regularly — it's designed to improve performance by reducing repeated DNS lookups. Only flush it when you encounter DNS-related issues, after changing DNS servers, or if a website you know is working seems unreachable from your device."
---

## Understanding the "DNS Server Not Responding" Error

If you've ever tried to open a website and been met with a "DNS Server Not Responding" error, you know how frustrating it can be. This error essentially means your computer can't connect to the Domain Name System (DNS) server, which is the service responsible for translating human-readable domain names (like `google.com`) into machine-readable IP addresses (like `142.250.80.46`).

Without a functioning DNS connection, your browser has no way of knowing where to find the website you're trying to visit — even if your internet connection is otherwise working perfectly.

### What Is DNS? A Quick Overview

DNS stands for **Domain Name System**, and it functions like the internet's phone book. Every time you type a URL into your browser, a DNS server looks up the corresponding IP address and directs your connection to the right server. This lookup happens in milliseconds and is essential for virtually every internet activity.

When DNS fails, everything stops — web browsing, email, streaming, online gaming, and even many apps on your phone.

### Common Causes of DNS Errors

Before diving into solutions, it helps to understand why DNS errors occur:

- **Your ISP's DNS server is down or overloaded**
- **Router or modem firmware issues**
- **Corrupted DNS cache on your device**
- **Firewall or antivirus software blocking DNS requests**
- **Outdated network adapter drivers**
- **IPv6 connectivity problems**
- **Malware altering your DNS settings**
- **Network configuration errors**
- **Physical connection issues** (loose cables, faulty hardware)
- **ISP-level outages or maintenance**

Now let's walk through 10 proven solutions to fix this error, starting with the simplest and working up to more advanced troubleshooting.

## Solution 1: Restart Your Router and Modem

This is the oldest trick in the book — and it works more often than you'd expect. Restarting your router and modem clears their internal memory and forces them to re-establish connections with your ISP's DNS servers.

### How to Do It

1. **Unplug** your modem and router from power (if they're separate devices, unplug both)
2. **Wait 30-60 seconds** — this allows the devices to fully discharge and clear their memory
3. **Plug in the modem first** and wait for all indicator lights to stabilize (usually 1-2 minutes)
4. **Plug in the router** and wait for it to fully boot
5. **Try loading a website** to see if the DNS error is resolved

If you're using a combination modem/router device (common with ISP-provided equipment), simply unplug it, wait a full 60 seconds, and plug it back in.

## Solution 2: Flush Your DNS Cache

Your operating system stores recently looked-up DNS records in a local cache to speed up future requests. If this cache becomes corrupted or outdated, it can cause DNS errors.

### On Windows

Open **Command Prompt** as Administrator and run:

```
ipconfig /flushdns
```

You should see: "Successfully flushed the DNS Resolver Cache."

Then reset the DNS client service:

```
net stop dnscache
net start dnscache
```

### On macOS

Open **Terminal** and run:

```
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

Enter your administrator password when prompted. There won't be a confirmation message on macOS, but the cache is flushed.

### On Chrome Browser

Even if you flush your system DNS cache, Chrome maintains its own. Navigate to:

```
chrome://net-internals/#dns
```

Click **"Clear host cache"** to flush Chrome's internal DNS cache.

## Solution 3: Switch to a Public DNS Server

Your ISP's default DNS servers can be slow, unreliable, or occasionally go down entirely. Switching to a trusted public DNS server is one of the most effective long-term fixes for DNS problems.

### Recommended Public DNS Servers

| Provider | Primary DNS | Secondary DNS | Key Benefit |
|----------|------------|---------------|-------------|
| Google | 8.8.8.8 | 8.8.4.4 | Fast, reliable, global infrastructure |
| Cloudflare | 1.1.1.1 | 1.0.0.1 | Fastest response times, privacy-focused |
| Quad9 | 9.9.9.9 | 149.112.112.112 | Built-in malware blocking |
| OpenDNS | 208.67.222.222 | 208.67.220.220 | Customizable filtering options |

### How to Change DNS on Windows

1. Press **Win + R**, type `ncpa.cpl`, and press Enter
2. Right-click your active network adapter and select **Properties**
3. Select **Internet Protocol Version 4 (TCP/IPv4)** and click **Properties**
4. Select **"Use the following DNS server addresses"**
5. Enter your preferred DNS (e.g., `1.1.1.1` as preferred, `1.0.0.1` as alternate)
6. Click **OK** and close all windows

### How to Change DNS on macOS

1. Open **System Settings** > **Network**
2. Select your active connection (Wi-Fi or Ethernet)
3. Click **Details** > **DNS**
4. Click the **+** button and add your preferred DNS servers
5. Click **OK** and then **Apply**

After changing your DNS, flush your DNS cache (Solution 2) and try loading a website again.

## Solution 4: Disable Your Firewall and Antivirus Temporarily

Firewall and antivirus software can sometimes block DNS requests, especially after a recent update or configuration change.

### How to Test This

1. **Temporarily disable** your firewall and antivirus software
2. **Try loading a website** to see if the DNS error resolves
3. If it works, **re-enable your security software** and add an exception for DNS traffic (UDP port 53)

### On Windows

1. Open **Windows Security** > **Firewall & network protection**
2. Click your active network profile
3. Toggle **Microsoft Defender Firewall** to Off
4. Test your connection
5. **Remember to turn it back on** after testing

### On macOS

1. Open **System Settings** > **Network** > **Firewall**
2. Toggle the firewall off
3. Test your connection
4. Re-enable the firewall immediately after testing

**Important:** Never leave your firewall disabled permanently. If this solves the issue, configure your firewall rules to allow DNS traffic rather than keeping it off.

## Solution 5: Disable IPv6

IPv6 connectivity issues are a surprisingly common cause of DNS errors. If your network or ISP doesn't properly support IPv6, it can interfere with DNS resolution.

### On Windows

1. Open **Network Connections** (Win + R, type `ncpa.cpl`)
2. Right-click your active adapter and select **Properties**
3. **Uncheck** "Internet Protocol Version 6 (TCP/IPv6)"
4. Click **OK**

### On macOS

1. Open **Terminal** and run:

```
networksetup -setv6off Wi-Fi
```

To re-enable IPv6 later:

```
networksetup -setv6automatic Wi-Fi
```

## Solution 6: Update Your Network Adapter Drivers

Outdated or corrupted network drivers can cause all sorts of connectivity issues, including DNS failures.

### On Windows

1. Press **Win + X** and select **Device Manager**
2. Expand **Network adapters**
3. Right-click your network adapter and select **Update driver**
4. Choose **"Search automatically for drivers"**
5. Restart your computer after the update completes

Alternatively, visit your network adapter manufacturer's website (Intel, Realtek, Qualcomm, etc.) to download the latest driver directly.

### On macOS

macOS handles network drivers through system updates. Make sure your system is up to date:

1. Open **System Settings** > **General** > **Software Update**
2. Install any available updates

## Solution 7: Reset Winsock and TCP/IP Stack (Windows)

The Winsock catalog and TCP/IP stack can become corrupted, causing persistent DNS issues. Resetting them returns your network configuration to a clean state.

### How to Reset

Open **Command Prompt** as Administrator and run these commands one at a time:

```
netsh winsock reset
```

```
netsh int ip reset
```

```
ipconfig /release
```

```
ipconfig /renew
```

```
ipconfig /flushdns
```

**Restart your computer** after running all commands. This process resets your entire network stack and is one of the most effective fixes for persistent DNS issues on Windows.

## Solution 8: Try Safe Mode with Networking

Booting into Safe Mode with Networking loads only essential drivers and services, which helps determine if a third-party program is causing the DNS issue.

### On Windows

1. Press **Win + I** to open Settings
2. Go to **System** > **Recovery**
3. Under "Advanced startup," click **Restart now**
4. Navigate to **Troubleshoot** > **Advanced options** > **Startup Settings** > **Restart**
5. Press **5** or **F5** to enable Safe Mode with Networking
6. Try loading a website in Safe Mode

If DNS works in Safe Mode, the problem is caused by a third-party application, driver, or service. Boot back into normal mode and use a process of elimination to identify the culprit — recently installed software is the most likely offender.

### On macOS

1. Shut down your Mac
2. Turn it on and immediately hold the **Shift** key (Intel) or hold the power button until you see "Loading startup options" (Apple Silicon)
3. For Apple Silicon, select your startup disk, then hold **Shift** and click "Continue in Safe Mode"
4. Test your internet connection

## Solution 9: Check for ISP Issues

Sometimes the problem isn't on your end at all — your ISP might be experiencing a DNS server outage.

### How to Check

1. **Visit your ISP's status page** using your phone's cellular data (not Wi-Fi)
2. **Check** [DownDetector.com](https://downdetector.com) for reports about your ISP
3. **Call your ISP's support line** to ask about known outages
4. **Try using a mobile hotspot** — if websites load fine on cellular data, the problem is with your ISP

### When to Contact Your ISP

Contact your ISP if:

- The issue persists after trying all the solutions above
- Multiple devices on your network have the same DNS problem
- Your neighbors report similar connectivity issues
- You see the error only with your ISP's DNS servers (public DNS like 8.8.8.8 works fine)
- The problem started after a service change or ISP maintenance

## Solution 10: Use a VPN to Bypass DNS Issues

A VPN can be a powerful solution for DNS problems because it completely bypasses your ISP's DNS servers. When you connect to a VPN, your DNS queries are handled by the VPN provider's own DNS servers, which are typically fast, reliable, and secure.

### Why This Works

- **Bypasses ISP DNS entirely** — Your DNS queries go through the VPN's encrypted tunnel to the VPN provider's DNS servers
- **Prevents DNS hijacking** — ISPs sometimes redirect failed DNS queries to their own search pages; a VPN stops this
- **Adds DNS leak protection** — Quality VPN services ensure your DNS queries never leak outside the encrypted tunnel
- **Provides a permanent fix** — If your ISP's DNS is chronically unreliable, using a VPN with built-in DNS handling gives you consistent, dependable resolution

For the best results, choose a VPN that specifically offers [DNS leak protection](/vpn-usa/posts/best-vpn-usa-dns-leak-protection/) to ensure all your DNS queries stay encrypted and private.

### How to Use a VPN for DNS Issues

1. **Subscribe** to a reputable VPN service
2. **Download and install** the VPN app on your device
3. **Connect** to a VPN server (preferably one geographically close to you for the best speed)
4. **Test your connection** — try loading the websites that previously showed the DNS error

## Bonus Tips for Preventing Future DNS Issues

### Keep Your System Updated

Operating system updates frequently include network stack improvements and security patches that can prevent DNS issues.

### Use a Reliable DNS Provider Permanently

Don't wait for DNS problems to switch from your ISP's default DNS. Proactively configure your system to use Google DNS (8.8.8.8), Cloudflare DNS (1.1.1.1), or another trusted public DNS provider.

### Monitor Your Network Equipment

- Replace your router every 3-5 years
- Keep your router's firmware updated
- Position your router centrally for consistent Wi-Fi coverage
- Consider using a mesh network system for larger homes

### Scan for Malware Regularly

Some malware specifically targets DNS settings, redirecting your traffic through malicious DNS servers. Run regular malware scans with reputable antivirus software to ensure your DNS settings haven't been tampered with.

### Configure DNS over HTTPS (DoH)

DNS over HTTPS encrypts your DNS queries, preventing interception and tampering. Most modern browsers support DoH:

**In Chrome:**
1. Go to `chrome://settings/security`
2. Enable "Use secure DNS"
3. Select a provider (Cloudflare, Google, etc.)

**In Firefox:**
1. Go to Settings > Privacy & Security
2. Scroll to "DNS over HTTPS"
3. Select "Max Protection" and choose a provider

## Quick Reference: DNS Troubleshooting Cheat Sheet

Here's a condensed version of all commands mentioned in this guide:

### Windows Commands (Run as Administrator)

```
ipconfig /flushdns
net stop dnscache && net start dnscache
netsh winsock reset
netsh int ip reset
ipconfig /release
ipconfig /renew
nslookup google.com
nslookup google.com 8.8.8.8
```

### macOS Commands (Terminal)

```
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
networksetup -setv6off Wi-Fi
networksetup -setv6automatic Wi-Fi
nslookup google.com
nslookup google.com 8.8.8.8
```

### Diagnostic Commands (Both Platforms)

Use `nslookup` to test DNS resolution:

```
nslookup google.com
```

If this fails but the following works, your current DNS server is the problem:

```
nslookup google.com 8.8.8.8
```

## Conclusion

The "DNS Server Not Responding" error is one of the most common internet issues, but it's almost always fixable. Start with the simple solutions — restart your router, flush your DNS cache, and switch to a public DNS server. These three steps alone resolve the vast majority of DNS problems.

If the basic fixes don't work, move on to disabling IPv6, updating network drivers, resetting the Winsock catalog, or testing in Safe Mode. And if your ISP's DNS servers are chronically unreliable, using a VPN with dedicated DNS servers can provide a permanent, hassle-free solution.

Remember: DNS issues are rarely a sign of a serious problem. With the right troubleshooting steps, you'll be back online in minutes.

*This article is for informational purposes only. For our full VPN recommendations, see our [complete VPN guide](/vpn-usa/posts/best-vpn-usa-2025/).*

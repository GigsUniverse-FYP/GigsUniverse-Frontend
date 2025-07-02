# Command:

## Next JS
1. pnpm run dev 
2. pnpm build / pnpm start

## NGROK
1. ngrok http 3000 [unsafe-no-auth]
2. ngrok start my-tunnel [username-password-auth]
3. ngrok config edit [configuration-refer-template-ngrok-section]
   - File Path: C://Users/user/AppData/Local/ngrok/ngrok.yml

# Template:

## NGROK [Test Server]
version: "2"
authtoken: <place auth token here>
tunnels:
  my-tunnel:  // Note: Can Change to Any Tunnel Name [changes command "ngrok start <tunnel-name>"]
    proto: http
    addr: <place address & port number here>
    basic_auth:  
      - "username:password"

## ENV
Acquiring the gmail certificate (TLS) - Need Validate So It could Work

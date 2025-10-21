# Sudoku (React Native + Expo)

A small Sudoku app built with React Native and Expo. The app supports multiple board sizes (4x4, 9x9, 16x16) and difficulty levels (easy, medium, hard).

Live demo (deployed):
https://sudoku-qmynbbg69-ahmeds-projects-a79b1e67.vercel.app

## Project structure

- `index.ts` - Expo entry that registers the root component
- `src/App.tsx` - Main app component and routing
- `src/Board.tsx` - Sudoku board component and logic
- `src/Cell.tsx` - Individual cell UI
- `src/Keyboard.tsx` - On-screen keypad for input
- `src/Setting.tsx` - Settings screen
- `src/context.ts` - App context and state providers
- `src/generater.ts` - Puzzle generator and helpers
- `src/Types.ts` - TypeScript types

## Development

This project uses Node.js and Expo.

Run locally (recommended):

```bash
# install dependencies
npm install

# start expo dev server
npm run start
```

Open the Expo app on your phone or use an emulator. The Metro bundler uses port 8081 by default.

## Docker (build + run)

The repository contains a `Dockerfile` and a `run` helper script that builds the image with `docker buildx` and runs the container while preserving the installed `node_modules` inside the image.

Make the helper executable and run it:

```bash
chmod +x ./run
./run
```

Notes:
- The script builds the image tagged `sudoku` and runs it with port 8081 exposed to the host.
- The start script in `package.json` uses `npx expo start`, so Expo CLI does not need to be globally installed inside the container.

## Ports

- 8081 — Metro bundler (required for React Native)
- (Optional) If you want to access the Expo dev tools UI, consider exposing 19000, 19001 and 19002 as well.

## Troubleshooting

- If `expo` is reported as missing when running in Docker, ensure you rebuilt the image after the changes:

```bash
docker buildx build -t sudoku .
```

- If hot-reload or modules seem missing, ensure you do not accidentally overwrite `/app/node_modules` from the host. The provided `run` script mounts the project but keeps a volume for `/app/node_modules`.

## License

MIT

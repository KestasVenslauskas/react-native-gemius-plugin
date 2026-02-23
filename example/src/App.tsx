import { useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Gemius, { DURATION_LIVE_STREAM } from 'react-native-gemius-plugin';

// ─── Default test values ──────────────────────────────────────────────────────
const APP_NAME = 'APP_NAME';
const VIEW_SCRIPT_ID = 'VIEW_SCRIPT_ID';
const PLAYER_SCRIPT_ID = 'PLAYER_SCRIPT_ID';

const HOST = 'https://galt.hit.gemius.pl';
const CLIP_ID = 'clip-001';
const PLAYER_ID = 'player-001';

type LogEntry = { ok: boolean; msg: string };

function call(label: string, fn: () => void, log: (e: LogEntry) => void) {
  try {
    fn();
    log({ ok: true, msg: `✓ ${label}` });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    log({ ok: false, msg: `✗ ${label}: ${message}` });
  }
}

// ─── Individual test sections ─────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (entry: LogEntry) =>
    setLogs((prev) => [entry, ...prev].slice(0, 50));

  const run = (label: string, fn: () => void) => call(label, fn, addLog);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {/* ── App info ── */}
        <Section title="App Info">
          <Button
            title="setAppInfo"
            onPress={() =>
              run('setAppInfo', () =>
                Gemius.setAppInfo(APP_NAME, '1.0.0', HOST, VIEW_SCRIPT_ID)
              )
            }
          />
        </Section>

        {/* ── Audience events ── */}
        <Section title="Audience Events">
          <Button
            title="sendPageViewedEvent"
            onPress={() =>
              run('sendPageViewedEvent', () =>
                Gemius.sendPageViewedEvent(VIEW_SCRIPT_ID)
              )
            }
          />
          <Button
            title="sendPageViewedEvent (with params)"
            onPress={() =>
              run('sendPageViewedEvent (params)', () =>
                Gemius.sendPageViewedEvent(VIEW_SCRIPT_ID, {
                  ep1: 'test',
                  ep2: 42,
                })
              )
            }
          />
          <Button
            title="sendPartialPageViewedEvent"
            onPress={() =>
              run('sendPartialPageViewedEvent', () =>
                Gemius.sendPartialPageViewedEvent(VIEW_SCRIPT_ID)
              )
            }
          />
          <Button
            title="sendActionEvent"
            onPress={() =>
              run('sendActionEvent', () =>
                Gemius.sendActionEvent(VIEW_SCRIPT_ID, { action: 'tap' })
              )
            }
          />
        </Section>

        {/* ── Player setup ── */}
        <Section title="Player Setup">
          <Button
            title="setPlayerInfo"
            onPress={() =>
              run('setPlayerInfo', () =>
                Gemius.setPlayerInfo(PLAYER_ID, HOST, PLAYER_SCRIPT_ID)
              )
            }
          />
          <Button
            title="setProgramData (video, 120 s)"
            onPress={() =>
              run('setProgramData (video)', () =>
                Gemius.setProgramData(CLIP_ID, 'Test Video', 120, true)
              )
            }
          />
          <Button
            title="setProgramData (audio, 90 s)"
            onPress={() =>
              run('setProgramData (audio)', () =>
                Gemius.setProgramData(CLIP_ID, 'Test Audio', 90, false)
              )
            }
          />
          <Button
            title="setProgramData (live stream)"
            onPress={() =>
              run('setProgramData (live)', () =>
                Gemius.setProgramData(
                  CLIP_ID,
                  'Live Stream',
                  DURATION_LIVE_STREAM,
                  true
                )
              )
            }
          />
        </Section>

        {/* ── Playback events ── */}
        <Section title="Playback Events">
          <Button
            title="sendPlay (offset 0)"
            onPress={() => run('sendPlay', () => Gemius.sendPlay(CLIP_ID, 0))}
          />
          <Button
            title="sendPause (offset 30)"
            onPress={() =>
              run('sendPause', () => Gemius.sendPause(CLIP_ID, 30))
            }
          />
          <Button
            title="sendBuffer (offset 30)"
            onPress={() =>
              run('sendBuffer', () => Gemius.sendBuffer(CLIP_ID, 30))
            }
          />
          <Button
            title="sendSeek (offset 60)"
            onPress={() => run('sendSeek', () => Gemius.sendSeek(CLIP_ID, 60))}
          />
          <Button
            title="sendStop (offset 60)"
            onPress={() => run('sendStop', () => Gemius.sendStop(CLIP_ID, 60))}
          />
          <Button
            title="sendComplete (offset 120)"
            onPress={() =>
              run('sendComplete', () => Gemius.sendComplete(CLIP_ID, 120))
            }
          />
          <Button
            title="sendClose (offset 120)"
            onPress={() =>
              run('sendClose', () => Gemius.sendClose(CLIP_ID, 120))
            }
          />
        </Section>

        {/* ── Full play-through sequence ── */}
        <Section title="Full Sequence">
          <Button
            title="Run full play-through"
            onPress={() => {
              run('setAppInfo', () =>
                Gemius.setAppInfo(APP_NAME, '1.0.0', HOST, VIEW_SCRIPT_ID)
              );
              run('sendPageViewedEvent', () =>
                Gemius.sendPageViewedEvent(VIEW_SCRIPT_ID)
              );
              run('setPlayerInfo', () =>
                Gemius.setPlayerInfo(PLAYER_ID, HOST, PLAYER_SCRIPT_ID)
              );
              run('setProgramData', () =>
                Gemius.setProgramData(CLIP_ID, 'Test Video', 120, true)
              );
              run('sendPlay', () => Gemius.sendPlay(CLIP_ID, 0));
              run('sendPause', () => Gemius.sendPause(CLIP_ID, 30));
              run('sendSeek', () => Gemius.sendSeek(CLIP_ID, 60));
              run('sendPlay (resume)', () => Gemius.sendPlay(CLIP_ID, 60));
              run('sendComplete', () => Gemius.sendComplete(CLIP_ID, 120));
              run('sendClose', () => Gemius.sendClose(CLIP_ID, 120));
            }}
          />
        </Section>

        {/* ── Log ── */}
        <Section title="Log">
          <Button title="Clear log" onPress={() => setLogs([])} />
          {logs.length === 0 && (
            <Text style={styles.logEmpty}>No calls yet.</Text>
          )}
          {logs.map((entry, i) => (
            <Text
              key={i}
              style={[styles.logEntry, entry.ok ? styles.logOk : styles.logErr]}
            >
              {entry.msg}
            </Text>
          ))}
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#888',
    marginBottom: 2,
  },
  logEmpty: {
    color: '#aaa',
    fontStyle: 'italic',
  },
  logEntry: {
    fontFamily: 'Menlo',
    fontSize: 12,
    paddingVertical: 2,
  },
  logOk: {
    color: '#2a9d2a',
  },
  logErr: {
    color: '#cc2222',
  },
});

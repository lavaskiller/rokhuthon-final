#!/bin/bash
# 인터넷 연결 감시 — systemd 타이머로 2분마다 실행 (net-watchdog.timer)
# 연속 실패 횟수에 따라 단계적으로 복구:
#   1회~   Wi-Fi 켜기 + 연결 다시 올리기
#   3회~   NetworkManager 재시작
#   REBOOT_AFTER 회 (기본 15 ≈ 30분) + 부팅 후 1시간 경과 시 재부팅 (0 = 재부팅 안 함)
set -u

STATE=/run/net-watchdog.fails
REBOOT_AFTER=${REBOOT_AFTER:-15}
IFACE=${IFACE:-wlan0}
log() { logger -t net-watchdog "$*"; }

online() {
  for host in 1.1.1.1 8.8.8.8 api.starflowernori.com; do
    ping -c1 -W3 "$host" >/dev/null 2>&1 && return 0
  done
  return 1
}

fails=$(cat "$STATE" 2>/dev/null || echo 0)

if online; then
  [ "$fails" -gt 0 ] && log "online again after $fails failed checks"
  echo 0 > "$STATE"
  exit 0
fi

fails=$((fails + 1))
echo "$fails" > "$STATE"
log "offline (check #$fails)"

nmcli radio wifi on
conn=$(nmcli -t -f NAME,TYPE connection show | awk -F: '$2 ~ /wireless/ {print $1; exit}')
if [ -n "$conn" ]; then
  nmcli connection up "$conn" ifname "$IFACE" >/dev/null 2>&1 && log "reconnected $conn" || log "nmcli up $conn failed"
else
  nmcli device connect "$IFACE" >/dev/null 2>&1 || log "nmcli device connect $IFACE failed"
fi

if [ "$fails" -ge 3 ]; then
  log "restarting NetworkManager"
  systemctl restart NetworkManager
fi

uptime_s=$(cut -d. -f1 /proc/uptime)
if [ "$REBOOT_AFTER" -gt 0 ] && [ "$fails" -ge "$REBOOT_AFTER" ] && [ "$uptime_s" -gt 3600 ]; then
  log "offline for $fails checks — rebooting"
  echo 0 > "$STATE"
  systemctl reboot
fi

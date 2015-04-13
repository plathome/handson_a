#!/bin/bash

#
# setup script for BX1 Wi-Fi
#
# run: SSID=your_ssid PPHS=wpa_passphrase bash $0
#

cat << EOT > /etc/wpa_supplicant/wpa.conf
ctrl_interface=/var/run/wpa_supplicant
ap_scan=1
network={
  ssid="${SSID}"
  key_mgmt=WPA-PSK
  proto=WPA WPA2
  pairwise=CCMP TKIP
  group=CCMP TKIP
  psk="${PPHS}"
}
EOT
cat << EOT > /etc/network/interfaces
auto lo
iface lo inet loopback

auto wlan0
iface wlan0 inet dhcp
  wpa-conf /etc/wpa_supplicant/wpa.conf
EOT

cat << EOT
# ifdown wlan0
# ifup   wlan0
# ip addr show dev wlan0
EOT

exit 0


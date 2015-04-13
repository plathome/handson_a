#!/bin/bash

#
# setup script for BX1 hands-on seminar (a0417)
#
# 1. Wi-Fi
# 2. OS
#   - Bluetooth boot (in rc.local)
#   - locale
# 3. Node.js (using nvm | install to ~root/.nvm/)
#
# run: SSID=your_ssid PPHS=wpa_passphrase sh setup 
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
sed -i 's/^/#/' /etc/network/interfaces
cat << EOT >> /etc/network/interfaces
auto lo
iface lo inet loopback

auto wlan0
iface wlan0 inet dhcp
  wpa-conf /etc/wpa_supplicant/wpa.conf
EOT
ifdown wlan0
ifup wlan0

sed -i "/^exit 0/i bluetooth_rfkill_event &\nsleep 1\nrfkill unblock bluetooth\n\nstty rows 80 cols 200\n" /etc/rc.local

apt-get update
apt-get install -y ntpdate
ntpdate ntp1.jst.mfeed.ad.jp
apt-get install -y locales
sed -i 's/^# ja_JP.UTF-8 UTF-8/ja_JP.UTF-8 UTF-8/' /etc/locale.gen
dpkg-reconfigure -f noninteractive locales

apt-get install -y curl ca-certificates build-essential git
curl https://raw.githubusercontent.com/creationix/nvm/v0.24.0/install.sh | bash
source ~/.nvm/nvm.sh
nvm install v0.12.2
nvm alias default v0.12.2
echo -e "\nexport NVM_DIR=\"$NVM_DIR\"\n[ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\"  # This loads nvm" >> ~/.bashrc

exit 0

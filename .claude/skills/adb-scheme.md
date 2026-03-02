---
name: adb-scheme
description: Open Android scheme links via adb. Usage: say "打开 scheme sinaweibo://detail?mblogid=xxx" to open on connected Android device.
---

# ADB 打开 Scheme 技能 - 执行指令

## 触发条件
用户说以下内容时触发此技能：
- "打开 scheme <scheme_url>"
- "open scheme <scheme_url>"
- "adb 打开 <scheme_url>"
- "用 adb 打开 <scheme_url>"

---

## 功能说明

通过 ADB（Android Debug Bridge）在连接的 Android 设备上打开自定义 Scheme 链接。

### 常见 Scheme 示例

| 应用 | Scheme 格式 |
|------|-------------|
| 微博 | `sinaweibo://detail?mblogid=xxx` |
| 微信 | `weixin://` |
| 支付宝 | `alipay://` |
| 淘宝 | `taobao://` |
| 抖音 | `snssdk1128://` |
| 知乎 | `zhihu://` |

---

## 前置要求

### 1. 安装 ADB

**Mac (Homebrew)**:
```bash
brew install android-platform-tools
```

**Linux**:
```bash
sudo apt-get install android-tools-adb
```

**Windows**:
1. 下载 Android Platform Tools: https://developer.android.com/tools/releases/platform-tools
2. 解压并添加到 PATH

### 2. 连接 Android 设备

1. 开启 USB 调试模式
2. 用 USB 连接电脑
3. 设备上确认 USB 调试授权
4. 验证连接：
```bash
adb devices
```

---

## 使用方法

### 基本用法

```bash
adb shell am start -a android.intent.action.VIEW -d "sinaweibo://detail?mblogid=4947343943142271"
```

### 完整脚本

创建一个脚本 `adb_open_scheme.sh`：

```bash
#!/bin/bash
# ADB 打开 Scheme 脚本
# 用法: ./adb_open_scheme.sh sinaweibo://detail?mblogid=xxx

if [ -z "$1" ]; then
    echo "用法: $0 <scheme_url>"
    echo "示例: $0 sinaweibo://detail?mblogid=4947343943142271"
    exit 1
fi

SCHEME_URL="$1"

echo "正在通过 ADB 打开: $SCHEME_URL"

adb shell am start -a android.intent.action.VIEW -d "$SCHEME_URL"

if [ $? -eq 0 ]; then
    echo "✓ 命令已发送"
else
    echo "✗ 执行失败，请检查:"
    echo "  1. 设备是否已连接 (adb devices)"
    echo "  2. URL 格式是否正确"
    exit 1
fi
```

### 使用脚本

```bash
# 赋予执行权限
chmod +x adb_open_scheme.sh

# 打开微博
./adb_open_scheme.sh sinaweibo://detail?mblogid=4947343943142271

# 打开微信
./adb_open_scheme.sh weixin://

# 打开支付宝
./adb_open_scheme.sh alipay://platformapi/startapp?saId=xxx
```

---

## 参数说明

| 参数 | 说明 |
|------|------|
| `am start` | Activity Manager 启动命令 |
| `-a android.intent.action.VIEW` | Intent 动作：查看内容 |
| `-d <URI>` | 数据 URI（scheme 地址） |
| `-n <Component>` | 可选，直接指定组件（如包名/Activity） |

---

## 常见问题

### Q1: 提示 "more than one device"
**A**: 有多个设备连接，需要指定设备：
```bash
adb -d shell am start -a android.intent.action.VIEW -d "scheme_url"  # USB 设备
adb -e shell am start -a android.intent.action.VIEW -d "scheme_url"  # 模拟器
# 或指定设备序列号
adb -s <serial> shell am start -a android.intent.action.VIEW -d "scheme_url"
```

### Q2: 提示 "Activity not started"
**A**: 设备上没有安装处理该 scheme 的应用，需要先安装对应应用。

### Q3: 设备未连接
**A**:
1. 检查 USB 调试是否开启
2. 尝试重新连接 USB
3. 运行 `adb devices` 查看设备列表

### Q4: URL 包含特殊字符
**A**: 用引号包裹 URL：
```bash
adb shell am start -a android.intent.action.VIEW -d 'sinaweibo://detail?mblogid=xxx&key=value'
```

---

## 完成后提醒

执行完成后：
- 在 Android 设备上应该会自动弹出对应应用
- 如果应用已打开，可能会跳转到指定页面

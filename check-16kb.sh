#!/bin/bash
# Script para verificar compatibilidad 16KB en un APK/AAB

if [ -z "$1" ]; then
    echo "Uso: ./check-16kb.sh archivo.aab"
    exit 1
fi

FILE="$1"
TEMP_DIR="/tmp/check_16kb_$$"

echo "Extrayendo $FILE..."
mkdir -p "$TEMP_DIR"
unzip -q "$FILE" -d "$TEMP_DIR"

echo ""
echo "Verificando bibliotecas nativas arm64-v8a..."
echo "================================================"

find "$TEMP_DIR" -name "*.so" -path "*/arm64-v8a/*" | while read so_file; do
    basename=$(basename "$so_file")
    
    # Verificar alineación ELF
    alignment=$(llvm-objdump -p "$so_file" 2>/dev/null | grep "LOAD" | awk '{print $NF}' | head -1)
    
    if [[ "$alignment" == "2**14" ]]; then
        echo "✓ $basename - ALINEADO 16KB"
    else
        echo "✗ $basename - NO ALINEADO ($alignment)"
    fi
done

# Limpiar
rm -rf "$TEMP_DIR"

echo ""
echo "Verificación completada"

#!/bin/bash

# Convert markdown to PDF using pandoc with custom template
# Usage: ./convert-to-pdf.sh input.md [output.pdf] [--borders]

BORDERS=false
INPUT_FILE=""
OUTPUT_FILE=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --borders)
            BORDERS=true
            shift
            ;;
        *)
            if [ -z "$INPUT_FILE" ]; then
                INPUT_FILE="$1"
            elif [ -z "$OUTPUT_FILE" ]; then
                OUTPUT_FILE="$1"
            fi
            shift
            ;;
    esac
done

if [ -z "$INPUT_FILE" ]; then
    echo "Usage: $0 <input.md> [output.pdf] [--borders]"
    echo "Example: $0 06-final-presentation.md final-presentation.pdf"
    echo "Example with borders: $0 06-final-presentation.md final-presentation.pdf --borders"
    exit 1
fi

if [ -z "$OUTPUT_FILE" ]; then
    OUTPUT_FILE="${INPUT_FILE%.md}.pdf"
fi

if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: Input file '$INPUT_FILE' not found."
    exit 1
fi

# Choose template based on borders option
if [ "$BORDERS" = true ]; then
    TEMPLATE="template-simple-borders.tex"
    echo "Converting $INPUT_FILE to $OUTPUT_FILE with table borders..."
else
    TEMPLATE="template.tex"
    echo "Converting $INPUT_FILE to $OUTPUT_FILE..."
fi

# Check if xelatex is available
if ! command -v xelatex &> /dev/null; then
    echo "Error: xelatex is required for Chinese font support but not found."
    echo "Please install a LaTeX distribution that includes XeLaTeX (e.g., MacTeX, TeX Live)."
    exit 1
fi

# Generate intermediate LaTeX file with adjusted column widths
TEMP_TEX="${OUTPUT_FILE%.pdf}.temp.tex"
TEX_DIR="$(cd "$(dirname "$TEMP_TEX")" && pwd)"
TEX_BASE="$(basename "$TEMP_TEX")"

pandoc "$INPUT_FILE" \
    --from=markdown+grid_tables+multiline_tables \
    --template="$TEMPLATE" \
    -o "$TEMP_TEX"

# Adjust table column widths for better distribution
# Stakeholder: 0.18, Interests: 0.30, Position: 0.15, Power: 0.10, Power Source: 0.27
sed -i '' \
    -e 's/real{0\.2364}/real{0.18}/g' \
    -e 's/real{0\.2000}/real{0.30}/g' \
    -e 's/real{0\.1818}/real{0.15}/g' \
    -e 's/real{0\.1273}/real{0.10}/g' \
    -e 's/real{0\.2545}/real{0.27}/g' \
    "$TEMP_TEX"

# XeLaTeX writes outputs next to the source only if we set -output-directory (otherwise
# PDF/log land in the current working directory when TEMP_TEX is in a subdirectory).
# XeLaTeX also returns non-zero for some warnings though the PDF is valid.
latex_run_ok() {
    local logf="${TEX_DIR}/${TEX_BASE%.tex}.log"
    local pdf="${TEX_DIR}/${TEX_BASE%.tex}.pdf"
    [ -s "$pdf" ] || return 1
    if [ -f "$logf" ] && grep -qE '^! |^No pages of output\.?$|Emergency stop|Fatal error' "$logf"; then
        return 1
    fi
    return 0
}

XELATEX_CMD=(xelatex -interaction=nonstopmode -output-directory="$TEX_DIR" "$TEMP_TEX")

# Convert to PDF using XeLaTeX (run twice for table of contents)
echo "Running xelatex (first pass)..."
"${XELATEX_CMD[@]}" > /dev/null 2>&1 || true
if ! latex_run_ok; then
    echo "❌ First XeLaTeX pass failed. Running with verbose output for debugging:"
    "${XELATEX_CMD[@]}"
    rm -f "${TEX_DIR}/${TEX_BASE%.tex}.aux" "${TEX_DIR}/${TEX_BASE%.tex}.log" "${TEX_DIR}/${TEX_BASE%.tex}.toc" "${TEX_DIR}/${TEX_BASE%.tex}.out" "$TEMP_TEX"
    exit 1
fi

echo "Running xelatex (second pass for TOC)..."
"${XELATEX_CMD[@]}" > /dev/null 2>&1 || true
if ! latex_run_ok; then
    echo "❌ Second XeLaTeX pass failed. Running with verbose output for debugging:"
    "${XELATEX_CMD[@]}"
    rm -f "${TEX_DIR}/${TEX_BASE%.tex}.aux" "${TEX_DIR}/${TEX_BASE%.tex}.log" "${TEX_DIR}/${TEX_BASE%.tex}.toc" "${TEX_DIR}/${TEX_BASE%.tex}.out" "$TEMP_TEX"
    exit 1
fi

# Clean up temporary files
rm -f "${TEX_DIR}/${TEX_BASE%.tex}.aux" "${TEX_DIR}/${TEX_BASE%.tex}.log" "${TEX_DIR}/${TEX_BASE%.tex}.toc" "${TEX_DIR}/${TEX_BASE%.tex}.out" "$TEMP_TEX"

FINAL_PDF="${TEX_DIR}/${TEX_BASE%.tex}.pdf"
if [ -f "$FINAL_PDF" ]; then
    mv "$FINAL_PDF" "$OUTPUT_FILE"
    echo "✅ Successfully converted to $OUTPUT_FILE"
else
    echo "❌ Conversion failed - PDF file not generated"
    exit 1
fi 
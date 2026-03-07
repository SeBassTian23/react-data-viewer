const loadNDJSON = async (file) => {
  const data = [];
  const reader = file.stream().getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      
      // Keep last incomplete line in buffer
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed) {
          try {
            data.push(JSON.parse(trimmed));
          } catch (e) {
            throw new Error(`Invalid JSON: ${trimmed.substring(0, 50)}`);
          }
        }
      }
    }

    // Handle final line
    if (buffer.trim()) {
      data.push(JSON.parse(buffer.trim()));
    }

    return { data };
  } catch (e) {
    reader.cancel();
    throw e;
  }
};

export default loadNDJSON;
def get_visualization(language: str, code: str, pseudocode: str):
    language = language.lower()

    # Python → Python Tutor
    if language == "python":
        return {
            "type": "iframe",
            "url": "https://pythontutor.com/iframe-embed.html"
        }

    # JavaScript → JS Visualizer 9000
    if language in ["javascript", "js"]:
        return {
            "type": "iframe",
            "url": "https://www.jsv9000.app/"
        }

    # C / C++ → Mermaid (placeholder for now)
    if language in ["c", "cpp", "c++"]:
        return {
            "type": "mermaid",
            "diagram": "graph TD\nStart --> End"
        }

    # Java → Java visualizer
    if language == "java":
        return {
            "type": "iframe",
            "url": "https://cscircles.cemc.uwaterloo.ca/java_visualize/"
        }

    raise ValueError("Visualization not supported for this language")

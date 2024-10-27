import configparser

class ConfigHandler:
    def __init__(self, config_file):
        self.config = configparser.ConfigParser()
        self.config.read(config_file)

    def get(self, key, section='DEFAULT'):
        return self.config.get(section, key)

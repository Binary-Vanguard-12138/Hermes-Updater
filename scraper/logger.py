from cmath import log
import os
import platform
import logging

LOG_FILE_PATH = 'E:/log/hermes_update_debug.log' if platform.system(
) == 'Windows' else '/tmp/hermes_update_debug.log'

root_loggers = {}


def get_root_logger(logger_name, filename=None):
    global root_loggers
    if logger_name in root_loggers:
        return root_loggers[logger_name]
    ''' get the logger object '''
    logger = logging.getLogger(logger_name)
    debug = os.environ.get('ENV', 'development') == 'development'
    # logger.setLevel(logging.DEBUG if debug else logging.INFO)
    logger.setLevel(logging.DEBUG)

    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    if None == filename:
        filename = LOG_FILE_PATH

    if debug:
        ch = logging.StreamHandler()
        ch.setFormatter(formatter)
        logger.addHandler(ch)

    fh = logging.FileHandler(filename, "w", "utf-8")
    fh.setFormatter(formatter)
    logger.addHandler(fh)

    root_loggers[logger_name] = logger
    return logger


def get_child_logger(root_logger, name):
    return logging.getLogger('.'.join([root_logger, name]))

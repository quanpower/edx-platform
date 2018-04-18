#!/usr/bin/env python
"""
List any dependencies on development utilities in edx-platform from
non-development modules.  Generally, there shouldn't be any; such a dependency
could result in ImportErrors in production or tests where development packages
aren't installed.

This script counts on scripts/dependencies/enumerate.sh having already
been run in order to generate a dependency data file to work from.
"""
from __future__ import absolute_import, print_function

import re

# Enumerate all the Python modules that should only be imported from development utilities
pattern_fragments = [
    # Development utility modules within edx-platform
    r'^xmodule/modulestore/perf_tests'        # modulestore performance tests

    # Development-only package dependencies
    r'^code_block_timer',                     # code_block_timer
    r'^debug_toolbar',                        # django-debug-toolbar
]

dev_pattern = re.compile('|'.join(pattern_fragments))

with open('reports/dependencies/dependencies.txt', 'r') as f:
    for dep in map(eval, f):
        (from_root, from_name), (to_root, to_name) = dep
        if to_name is None:
            continue
        if dev_pattern.search(to_name) and not dev_pattern.search(from_name):
            # We usually don't care about dependencies between modules in site-packages
            if from_root.endswith(u'site-packages') and to_root.endswith(u'site-packages'):
                continue
            # The django-debug-toolbar URL imports are safely behind conditions on INSTALLED_APPS
            if from_name in {u'cms/urls.py', u'lms/urls.py'} and to_name == u'debug_toolbar':
                continue
            print(dep)

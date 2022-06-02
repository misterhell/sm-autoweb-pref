FROM 18-alpine


COPY .

RUN git submodule update --init --recursive
RUN cd ./AutoWebPerf && npm imstall


CMD ""